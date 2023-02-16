use std::collections::BTreeMap;

use anchor_lang::prelude::*;

use crate::{state::{PromiseState, promisor_rules::PromisorRules}, errors::PromiseError, promisor_ruleset::EvaluationContext};

use super::InitializePromise;

pub fn update_promise(ctx: Context<InitializePromise>, state: PromiseState) -> Result<()> {
    match state {
        PromiseState::Created => {
          return Err(PromiseError::InvalidPromiseState.into());
        },
        PromiseState::Active => {
            if ctx.accounts.promise.state == PromiseState::Created {
                return set_active(ctx, state);
            }
            return Err(PromiseError::InvalidPromiseState.into());
        },
        PromiseState::Completed => {
          // Run the post_action ruleset here
          return Err(PromiseError::InvalidPromiseState.into());
        },
        PromiseState::Voided => {
          // Run the post_action ruleset here
          return Err(PromiseError::InvalidPromiseState.into());
        },
        _ => {
            return Err(PromiseError::InvalidPromiseState.into());
        }
    }
}

fn set_active(ctx: Context<InitializePromise>, state: PromiseState) -> Result<()> {
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
        condition.pre_action(&ctx, &mut evaluation_context)?;
    }

    ctx.accounts.promise.state = state;
    Ok(())
}