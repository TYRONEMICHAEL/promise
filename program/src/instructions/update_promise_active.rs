use std::collections::BTreeMap;

use anchor_lang::{
    prelude::*,
};

use crate::{
    errors::PromiseError,
    promisor_ruleset::EvaluationContext,
    state::{promisor_rules::PromisorRules, Promise, PromiseState, Promisor},
};

#[derive(Accounts)]
#[instruction()]
pub struct UpdatePromiseActive<'info> {
    #[account(mut, constraint = promise.promisor.key() == promisor.key())]
    pub promise: Account<'info, Promise>,
    #[account(mut, constraint = promisor_owner.key() == promisor.owner.key())]
    pub promisor: Account<'info, Promisor>,
    #[account(mut)]
    pub promisor_owner: Signer<'info>,
    pub system_program: Program<'info, System>,
}

pub fn update_promise_active<'info>(ctx: Context<'_, '_, '_, 'info, UpdatePromiseActive<'info>>) -> Result<()> {
    if ctx.accounts.promise.state != PromiseState::Created {
        return Err(PromiseError::InvalidPromiseState.into());
    }

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

    ctx.accounts.promise.state = PromiseState::Active;
    Ok(())
}