use crate::{
    errors::PromiseError,
    state::{promise_network::Rules, PromiseNetwork},
};
use anchor_lang::{
    prelude::*,
    solana_program::{program::invoke, system_instruction},
};

#[derive(Accounts)]
#[instruction(data: Vec<u8>)]
pub struct UpdateNetwork<'info> {
    #[account(
        mut,
        has_one = authority,
        seeds = [PromiseNetwork::SEED_PREFIX, authority.key().as_ref()],
        bump = promise_network.bump
    )]
    pub promise_network: Account<'info, PromiseNetwork>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

pub fn update_network(ctx: Context<UpdateNetwork>, data: Vec<u8>) -> Result<()> {
    // tries to deserialize the data to make sure it's valid
    match Rules::try_from_slice(&data) {
        Ok(rules) => rules,
        Err(e) => {
            msg!("Error deserializing ruleset: {}", e);
            return Err(PromiseError::DeserializationError.into());
        }
    };

    let account_info = ctx.accounts.promise_network.to_account_info();
    let existing_size = ctx.accounts.promise_network.account_size();
    let new_size = PromiseNetwork::DATA_OFFSET + data.len();
    let difference = new_size - existing_size;

    if difference > 0 {
        let rent = Rent::get()?;
        let new_minimum_balance = rent.minimum_balance(new_size);
        let lamports_diff = new_minimum_balance.saturating_sub(account_info.lamports());
        let funding_account = ctx.accounts.authority.to_account_info();

        invoke(
            &system_instruction::transfer(funding_account.key, account_info.key, lamports_diff),
            &[
                funding_account.clone(),
                account_info.clone(),
                ctx.accounts.system_program.to_account_info(),
            ],
        )?;
    } else {
        // TODO: add a way to reclaim lamports
    }

    msg!("Account realloc by {} bytes", difference);
    account_info.realloc(new_size, false)?;
    ctx.accounts.promise_network.data = data;
    Ok(())
}
