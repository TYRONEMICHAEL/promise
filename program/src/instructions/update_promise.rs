use std::collections::BTreeMap;

use anchor_lang::{
    prelude::*,
    solana_program::{program::invoke, system_instruction},
};

use crate::{
    errors::PromiseError,
    promisor_ruleset::EvaluationContext,
    state::{promisor_rules::PromisorRules, Promise, PromiseState, Promisor, PromisorState},
};

#[derive(Accounts)]
#[instruction(promisor_data: Vec<u8>, promisee_data: Vec<u8>, state: PromiseState)]
pub struct UpdatePromiseRules<'info> {
    #[account(mut, constraint = promisor.key() == promisor.key())]
    pub promise: Account<'info, Promise>,
    #[account(mut, constraint = promisor_owner.key() == promisor.owner.key())]
    pub promisor: Account<'info, Promisor>,
    #[account(mut)]
    pub promisor_owner: Signer<'info>,
    pub system_program: Program<'info, System>,
}

pub fn update_promise_rules<'info>(
    ctx: Context<'_, '_, '_, 'info, UpdatePromiseRules<'info>>,
    promisor_data: Vec<u8>,
    promisee_data: Vec<u8>,
) -> Result<()> {
    let rules = match PromisorRules::try_from_slice(&promisor_data) {
        Ok(rules) => rules,
        Err(e) => {
            msg!("Error deserializing promisor ruleset: {}", e);
            return Err(PromiseError::DeserializationError.into());
        }
    };

    let conditions = rules.enabled_conditions();

    let mut evaluation_context = EvaluationContext {
        account_cursor: 0,
        indices: BTreeMap::new(),
    };

    for condition in &conditions {
        condition.validate(
            &ctx.accounts.promisor,
            &ctx.accounts.promise,
            &ctx.remaining_accounts,
            &mut evaluation_context,
        )?;
    }

    let promisor = &mut ctx.accounts.promisor;
    let promise = &mut ctx.accounts.promise;

    if promisor.state != PromisorState::Active {
        return Err(PromiseError::PromisorNotActive.into());
    }

    let account_info = promise.to_account_info();
    let existing_size = promise.account_size();
    let new_size = Promise::DATA_OFFSET + promisor_data.len() + promisee_data.len();
    let difference = new_size - existing_size;

    msg!("Existing size: {}", existing_size);
    msg!("New size: {}", new_size);

    if difference > 0 {
        msg!("Resizing account by {} bytes", difference);
        let rent = Rent::get()?;
        let new_minimum_balance = rent.minimum_balance(new_size);
        let lamports_diff = new_minimum_balance.saturating_sub(account_info.lamports());
        let funding_account = ctx.accounts.promisor_owner.to_account_info();

        invoke(
            &system_instruction::transfer(funding_account.key, account_info.key, lamports_diff),
            &[
                funding_account.clone(),
                account_info.clone(),
                ctx.accounts.system_program.to_account_info(),
            ],
        )?;

        promise.promisor_data = promisor_data;
        promise.promisee_data = promisee_data;
        promise.updated_at = Clock::get()?.unix_timestamp;
    } else {
        // TODO: add a way to reclaim lamports
    }

    Ok(())
}

#[derive(Accounts)]
#[instruction(state: PromiseState)]
pub struct UpdatePromiseState<'info> {
    #[account(mut, constraint = promisor.key() == promisor.key())]
    pub promise: Account<'info, Promise>,
    #[account(mut, constraint = promisor_owner.key() == promisor.owner.key())]
    pub promisor: Account<'info, Promisor>,
    #[account(mut)]
    pub promisor_owner: Signer<'info>,
    pub system_program: Program<'info, System>,
}

pub fn update_promise_state<'info>(ctx: Context<'_, '_, '_, 'info, UpdatePromiseState<'info>>, state: PromiseState) -> Result<()> {
    match state {
        PromiseState::Created => Err(PromiseError::InvalidPromiseState.into()),
        PromiseState::Active => {
            if ctx.accounts.promise.state == PromiseState::Created {
                return set_active(ctx, state);
            }
            Err(PromiseError::InvalidPromiseState.into())
        }
        PromiseState::Completed => {
            // Run the post_action ruleset here
            Err(PromiseError::InvalidPromiseState.into())
        }
        PromiseState::Voided => {
            // Run the post_action ruleset here
            Err(PromiseError::InvalidPromiseState.into())
        }
    }
}

fn set_active<'b, 'info>(ctx: Context<'_, 'b, '_, 'info, UpdatePromiseState<'info>>, state: PromiseState) -> Result<()> {
    let promise = &ctx.accounts.promise;
    let rules = match PromisorRules::try_from_slice(&promise.promisor_data) {
        Ok(rules) => rules,
        Err(e) => {
            msg!("Error deserializing promisor ruleset: {}", e);
            return Err(PromiseError::DeserializationError.into());
        }
    };

    let conditions = rules.enabled_conditions();

    let mut evaluation_context = EvaluationContext {
        account_cursor: 0,
        indices: BTreeMap::new(),
    };

    for condition in &conditions {
        condition.pre_action(
            &ctx.accounts.promisor,
            &ctx.accounts.promise,
            &ctx.remaining_accounts,
            &mut evaluation_context,
        )?;
    }

    ctx.accounts.promise.state = state;
    Ok(())
}
