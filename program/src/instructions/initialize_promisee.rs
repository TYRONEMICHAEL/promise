use anchor_lang::prelude::*;

use crate::{
    state::{PromiseNetwork, Promisee},
};

#[derive(Accounts)]
#[instruction(bump: u8)]
pub struct InitializePromisee<'info> {
    #[account(
        init,
        payer = owner,
        space = Promisee::SIZE,
        seeds = [Promisee::SEED_PREFIX, promise_network.key().as_ref(), owner.key().as_ref()],
        bump
    )]
    pub promisee: Account<'info, Promisee>,
    pub promise_network: Account<'info, PromiseNetwork>,
    #[account(mut)]
    pub owner: Signer<'info>,
    pub system_program: Program<'info, System>,
}

pub fn initialize_promisee(ctx: Context<InitializePromisee>, bump: u8) -> Result<()> {
    let promise_network = &ctx.accounts.promise_network;
    let promisee = &mut ctx.accounts.promisee;

    promisee.bump = bump;
    promisee.owner = ctx.accounts.owner.key();
    promisee.promise_network = ctx.accounts.promise_network.key();
    promisee.created_at = Clock::get()?.unix_timestamp;
    promisee.updated_at = Clock::get()?.unix_timestamp;
    promisee.promise_network = promise_network.key();
    Ok(())
}
