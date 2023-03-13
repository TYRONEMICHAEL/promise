use std::collections::BTreeMap;

use crate::{
    errors::PromiseError,
    promisor_ruleset::EvaluationContext,
    state::{
        Promise, PromiseNetwork, PromiseState, PromiseeRules, Promisor, PromisorRules,
        PromisorState,
    },
};
use anchor_lang::prelude::*;
#[derive(Accounts)]
#[instruction(id: i32, promisor_data: Vec<u8>, promisee_data: Vec<u8>, bump: u8, uri: Option<String>)]
pub struct InitializePromise<'info> {
    #[account(
      init,
      payer = promisor_owner,
      space = Promise::DATA_OFFSET + promisor_data.len() + promisee_data.len(),
      seeds = [
        Promise::SEED_PREFIX,
        promise_network.key().as_ref(),
        promisor.key().as_ref(),
        &id.to_le_bytes()
      ],
      bump
  )]
    pub promise: Account<'info, Promise>,
    #[account(mut, constraint = promisor_owner.key() == promisor.owner.key())]
    pub promisor: Account<'info, Promisor>,
    #[account(mut)]
    pub promisor_owner: Signer<'info>,
    pub promise_network: Account<'info, PromiseNetwork>,
    pub system_program: Program<'info, System>,
}

pub fn initialize_promise<'info>(
    ctx: Context<'_, '_, '_, 'info, InitializePromise<'info>>,
    id: i32,
    promisor_data: Vec<u8>,
    promisee_data: Vec<u8>,
    bump: u8,
    uri: Option<String>,
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

    let promise_network = &ctx.accounts.promise_network;
    let promisor = &mut ctx.accounts.promisor;
    let promise = &mut ctx.accounts.promise;

    if promisor.state != PromisorState::Active {
        return Err(PromiseError::PromisorNotActive.into());
    }

    match PromiseeRules::try_from_slice(&promisee_data) {
        Ok(_) => (),
        Err(e) => {
            msg!("Error deserializing promisee ruleset: {}", e);
            return Err(PromiseError::DeserializationError.into());
        }
    }

    promisor.num_promises += 1;
    promise.id = id;
    promise.network = promise_network.key();
    promise.promisor = promisor.key();
    promise.bump = bump;
    promise.promisor_data = promisor_data;
    promise.promisee_data = promisee_data;
    promise.state = PromiseState::Created;
    promise.created_at = Clock::get()?.unix_timestamp;
    promise.updated_at = Clock::get()?.unix_timestamp;
    promise.uri = uri;
    Ok(())
}
