use anchor_lang::prelude::*;

use crate::{state::{promisor::PromisorState, PromiseNetwork, Promisor, Promise, PromiseState}, errors::PromiseError};

#[derive(Accounts)]
#[instruction(state: PromisorState)]
pub struct UpdatePromise<'info> {
    #[account(
      mut,
      has_one = promisor,
      seeds = [
        Promise::SEED_PREFIX,
        promise_network.key().as_ref(),
        promisor.key().as_ref(),
        &(promisor.num_promises + 1).to_le_bytes()
      ],
      bump = promise.bump,
      constraint = promise.network.key() == promise_network.key() && promise.promisor.key() == promisor.key()
  )]
    pub promise: Account<'info, Promise>,
    pub promise_network: Account<'info, PromiseNetwork>,
    pub promisor: Account<'info, Promisor>,
    #[account(mut)]
    #[account(constraint = promisor_owner.key() == promisor.owner.key())]
    pub promisor_owner: Signer<'info>,
}

pub fn update_promise(ctx: Context<UpdatePromise>, state: PromiseState) -> Result<()> {
    let promise = &mut ctx.accounts.promise;
    match state {
        PromiseState::Created => {
          return Err(PromiseError::InvalidPromiseState.into());
        },
        PromiseState::Active => {
            if promise.state == PromiseState::Created {
                // Run the pre_action ruleset here
                promise.state = state;
            } else {
                return Err(PromiseError::InvalidPromiseState.into());
            }
        },
        PromiseState::Completed => {
          // Run the post_action ruleset here
          return Err(PromiseError::InvalidPromiseState.into());
        },
        PromiseState::Voided => {
          // Run the post_action ruleset here
          promise.state = state;
        },
        _ => {
            return Err(PromiseError::InvalidPromiseState.into());
        }
        
    }
    Ok(())
}
