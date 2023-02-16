use std::collections::BTreeMap;

use crate::{state::{Promise, PromiseNetwork, Promisor, PromisorState, PromiseState, PromiseeRules, PromisorRules}, errors::PromiseError, promisor_ruleset::EvaluationContext};
use anchor_lang::prelude::*;
#[derive(Accounts)]
#[instruction(promisor_data: Vec<u8>, promisee_data: Vec<u8>, ends_at: i64, bump: u8)]
pub struct InitializePromise<'info> {
    #[account(
      init,
      payer = promisor_owner,
      space = Promise::DATA_OFFSET + promisor_data.len() + promisee_data.len(),
      seeds = [
        Promise::SEED_PREFIX,
        promise_network.key().as_ref(),
        promisor.key().as_ref(),
        &(promisor.num_promises + 1).to_le_bytes()
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

pub fn initialize_promise(ctx: Context<InitializePromise>, promisor_data: Vec<u8>, promisee_data: Vec<u8>, ends_at: i64, bump: u8) -> Result<()> {
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
    condition.validate(&ctx, &mut evaluation_context)?;
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

  promise.network = promise_network.key();
  promise.promisor = promisor.key();
  promise.bump = bump;
  promise.promisor_data = promisor_data;
  promise.promisee_data = promisee_data;
  promise.state = PromiseState::Created;
  promise.created_at = Clock::get()?.unix_timestamp;
  promise.updated_at = Clock::get()?.unix_timestamp;
  promise.ends_at = ends_at;

  // Run the validate ruleset here
  // SOL stake as an example
  Ok(())
}
