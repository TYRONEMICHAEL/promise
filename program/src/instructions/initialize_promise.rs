use crate::{state::{Promise, PromiseNetwork, Promisor, PromisorState, PromiseState, PromiseRules}, errors::PromiseError};
use anchor_lang::prelude::*;
#[derive(Accounts)]
#[instruction(data: Vec<u8>, ends_at: i64, bump: u8)]
pub struct InitializePromise<'info> {
    #[account(
      init,
      payer = promisor,
      space = Promise::DATA_OFFSET + data.len(),
      seeds = [
        Promise::SEED_PREFIX,
        promise_network.key().as_ref(),
        promisor.key().as_ref(),
        &(promisor.num_promises + 1).to_le_bytes()
      ],
      bump
  )]
    pub promise: Account<'info, Promise>,
    #[account(mut)]
    pub promisor: Account<'info, Promisor>,
    pub promise_network: Account<'info, PromiseNetwork>,
    pub system_program: Program<'info, System>,
}

pub fn initialize_promise(ctx: Context<InitializePromise>, data: Vec<u8>, ends_at: i64, bump: u8) -> Result<()> {
  let promise_network = &mut ctx.accounts.promise_network;
  let promisor = &mut ctx.accounts.promisor;
  let promise = &mut ctx.accounts.promise;

  if promisor.state != PromisorState::Active {
    return Err(PromiseError::PromisorNotActive.into());
  }

  match PromiseRules::try_from_slice(&data) {
    Ok(_) => (),
    Err(e) => {
        msg!("Error deserializing ruleset: {}", e);
        return Err(PromiseError::DeserializationError.into());
    }
}

  promisor.num_promises += 1;

  promise.network = promise_network.key();
  promise.promisor = promisor.key();
  promise.bump = bump;
  promise.data = data;
  promise.state = PromiseState::Created;
  promise.created_at = Clock::get()?.unix_timestamp;
  promise.updated_at = Clock::get()?.unix_timestamp;
  promise.ends_at = ends_at;
  Ok(())
}
