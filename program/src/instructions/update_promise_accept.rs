use std::collections::BTreeMap;

use anchor_lang::{
    prelude::*,
};

use crate::{
    errors::PromiseError,
    promisee_ruleset::EvaluationContext,
    state::{Promise, PromiseState, Promisee, promisee_rules::PromiseeRules},
};

#[derive(Accounts)]
#[instruction(bump: u8)]
pub struct UpdatePromiseAccept<'info> {
    #[account(
        init,
        payer = promisee_owner,
        space = Promisee::SIZE,
        seeds = [Promisee::SEED_PREFIX, promise.key().as_ref(), promisee_owner.key().as_ref()],
        bump
    )]
    pub promisee: Account<'info, Promisee>,
    #[account(mut)]
    pub promise: Account<'info, Promise>,
    #[account(mut)]
    pub promisee_owner: Signer<'info>,
    pub system_program: Program<'info, System>,
}

pub fn update_promise_accept<'info>(ctx: Context<'_, '_, '_, 'info, UpdatePromiseAccept<'info>>, bump: u8) -> Result<()> {
    if ctx.accounts.promise.state != PromiseState::Active {
        return Err(PromiseError::InvalidPromiseState.into());
    }

    let promise = &mut ctx.accounts.promise;
    let rules = match PromiseeRules::try_from_slice(&promise.promisee_data) {
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

    let promisee = &mut ctx.accounts.promisee;
    for condition in &conditions {
        condition.validate(
            promisee,
            promise,
            &ctx.remaining_accounts,
            &mut evaluation_context,
        )?;
    }

    for condition in &conditions {
        condition.pre_action(
            promisee,
            promise,
            &ctx.remaining_accounts,
            &mut evaluation_context,
        )?;
    }

    promisee.bump = bump;
    promisee.owner = ctx.accounts.promisee_owner.key();
    promisee.promise = promise.key();
    promisee.created_at = Clock::get()?.unix_timestamp;
    promisee.updated_at = Clock::get()?.unix_timestamp;

    promise.num_promisees += 1;
    promise.updated_at = Clock::get()?.unix_timestamp;
    Ok(())
}