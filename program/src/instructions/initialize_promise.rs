use crate::state::{Promise, PromiseNetwork, Promisor};
use anchor_lang::prelude::*;
#[derive(Accounts)]
#[instruction(data: Vec<u8>, bump: u8)]
pub struct InitializePromise<'info> {
    #[account(
      init,
      payer = promisor,
      space = Promise::DATA_OFFSET + data.len(),
      seeds = [
        Promise::SEED_PREFIX,
        promise_network.key().as_ref(),
        promisor.key().as_ref(),
        &(promisor.num_promises + 1).to_le_bytes()
      ],
      bump
  )]
    pub promise: Account<'info, Promise>,
    #[account(mut)]
    pub promisor: Account<'info, Promisor>,
    pub promise_network: Account<'info, PromiseNetwork>,
    pub system_program: Program<'info, System>,
}

pub fn initialize_promise(ctx: Context<InitializePromise>, data: Vec<u8>, bump: u8) -> Result<()> {
    Ok(())
}
