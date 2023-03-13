use std::collections::BTreeMap;

use anchor_lang::{
    prelude::*,
};

use crate::{
    errors::PromiseError,
    promisee_ruleset::EvaluationContext as PromiseeEvaluationContext,
    promisor_ruleset::EvaluationContext as PromisorEvaluationContext,
    state::{Promise, PromiseState, Promisee, promisee_rules::PromiseeRules, Promisor, promisor_rules::PromisorRules},
};

#[derive(Accounts)]
#[instruction(uri: Option<String>)]
pub struct UpdatePromiseCompleted<'info> {
    #[account(mut, constraint = promisor_owner.key() == promisor.owner.key())]
    pub promisor: Account<'info, Promisor>,
    #[account(mut, constraint = promisee.promise.key() == promise.key())]
    pub promisee: Account<'info, Promisee>,
    #[account(mut, constraint = promise.promisor.key() == promisor.key())]
    pub promise: Account<'info, Promise>,
    #[account(mut)]
    pub promisor_owner: Signer<'info>,
    pub system_program: Program<'info, System>,
}

pub fn update_promise_completed<'info>(ctx: Context<'_, '_, '_, 'info, UpdatePromiseCompleted<'info>>, uri: Option<String>) -> Result<()> {
    if ctx.accounts.promise.state != PromiseState::Active {
        return Err(PromiseError::InvalidPromiseState.into());
    }

    let promise = &mut ctx.accounts.promise;
    
    let promisee_rules = match PromiseeRules::try_from_slice(&promise.promisee_data) {
        Ok(rules) => rules,
        Err(e) => {
            msg!("Error deserializing promisor ruleset: {}", e);
            return Err(PromiseError::DeserializationError.into());
        }
    };

    let promisee_conditions = promisee_rules.enabled_conditions();
    let promisee = &mut ctx.accounts.promisee;

    let mut promisee_evaluation_context = PromiseeEvaluationContext {
      account_cursor: 0,
      indices: BTreeMap::new(),
    };
    
    for condition in &promisee_conditions {
        condition.post_action(
            promisee,
            promise,
            &ctx.remaining_accounts,
            &mut promisee_evaluation_context,
        )?;
    } 

    let promisor_rules = match PromisorRules::try_from_slice(&promise.promisor_data) {
      Ok(rules) => rules,
      Err(e) => {
          msg!("Error deserializing promisor ruleset: {}", e);
          return Err(PromiseError::DeserializationError.into());
      }
    };

    let promisor_conditions = promisor_rules.enabled_conditions();
    let promisor = &mut ctx.accounts.promisor;

    let mut promisor_evaluation_context = PromisorEvaluationContext {
      account_cursor: 0,
      indices: BTreeMap::new(),
    };

    for condition in &promisor_conditions {
      condition.post_action(
          promisor,
          promise,
          &ctx.remaining_accounts,
          &mut promisor_evaluation_context,
      )?;
    } 

    promise.state = PromiseState::Completed;
    promise.updated_at = Clock::get()?.unix_timestamp;
    promise.uri = uri;
    Ok(())
}