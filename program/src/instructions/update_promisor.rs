use anchor_lang::prelude::*;

use crate::state::{promisor::PromisorState, PromiseNetwork, Promisor};

#[derive(Accounts)]
#[instruction(state: PromisorState)]
pub struct UpdatePromisor<'info> {
    #[account(
      mut,
      has_one = owner,
      seeds = [Promisor::SEED_PREFIX, promise_network.key().as_ref(), owner.key().as_ref()],
      bump = promisor.bump,
      constraint = promisor.promise_network.key() == promise_network.key()
  )]
    pub promisor: Account<'info, Promisor>,
    pub promise_network: Account<'info, PromiseNetwork>,
    /// CHECK: Is this the right way to do this?
    pub owner: AccountInfo<'info>,
    #[account(mut)]
    #[account(constraint = authority.key() == promise_network.authority.key())]
    pub authority: Signer<'info>,
}

pub fn update_promisor(ctx: Context<UpdatePromisor>, state: PromisorState) -> Result<()> {
    let promisor = &mut ctx.accounts.promisor;
    promisor.state = state;
    Ok(())
}
