use std::collections::BTreeMap;

use anchor_lang::prelude::*;

use crate::{
    errors::PromiseError,
    promisor_ruleset::EvaluationContext,
    state::{promise_network::Rules, promisor::PromisorState, PromiseNetwork, Promisor},
};

#[derive(Accounts)]
#[instruction(bump: u8)]
pub struct InitializePromisor<'info> {
    #[account(
        init,
        payer = owner,
        space = Promisor::SIZE,
        seeds = [Promisor::SEED_PREFIX, promise_network.key().as_ref(), owner.key().as_ref()],
        bump
    )]
    pub promisor: Account<'info, Promisor>,
    pub promise_network: Account<'info, PromiseNetwork>,
    #[account(mut)]
    pub owner: Signer<'info>,
    pub system_program: Program<'info, System>,
}

pub fn initialize_promisor(ctx: Context<InitializePromisor>, bump: u8) -> Result<()> {
    let promise_network = &ctx.accounts.promise_network;

    let rules = match Rules::try_from_slice(&promise_network.data) {
        Ok(rules) => rules,
        Err(e) => {
            msg!("Error deserializing ruleset: {}", e);
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
        condition.pre_action(&ctx, &mut evaluation_context)?;
    }

    let promisor = &mut ctx.accounts.promisor;

    promisor.bump = bump;
    promisor.owner = ctx.accounts.owner.key();
    promisor.promise_network = ctx.accounts.promise_network.key();
    promisor.state = PromisorState::Active;
    promisor.num_promises = 0;
    Ok(())
}
