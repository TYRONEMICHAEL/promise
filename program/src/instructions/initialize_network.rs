use crate::{
    errors::PromiseError,
    state::{promise_network::NetworkRules, PromiseNetwork},
};
use anchor_lang::prelude::*;
#[derive(Accounts)]
#[instruction(data: Vec<u8>, bump: u8)]
pub struct InitializeNetwork<'info> {
    #[account(
        init,
        payer = authority,
        space = PromiseNetwork::DATA_OFFSET + data.len(),
        seeds = [PromiseNetwork::SEED_PREFIX, authority.key().as_ref()],
        bump
    )]
    pub promise_network: Account<'info, PromiseNetwork>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

pub fn initialize_network(ctx: Context<InitializeNetwork>, data: Vec<u8>, bump: u8) -> Result<()> {
    let promise_network = &mut ctx.accounts.promise_network;
    promise_network.bump = bump;
    promise_network.authority = ctx.accounts.authority.key();

    match NetworkRules::try_from_slice(&data) {
        Ok(_) => (),
        Err(e) => {
            msg!("Error deserializing ruleset: {}", e);
            return Err(PromiseError::DeserializationError.into());
        }
    }

    promise_network.data = data;
    Ok(())
}
