use std::collections::BTreeMap;
use anchor_lang::prelude::Context;
mod sol_wager;

pub use anchor_lang::prelude::*;
pub use sol_wager::SolWager;

use crate::instructions::initialize_promise::InitializePromise;

pub trait Condition {
    // Validate the inputs pass the condition.
    fn validate<'info>(
        &self,
        promisee: &Pubkey,
        ctx: &Context<InitializePromise<'info>>,
        evaluation_context: &mut EvaluationContext,
    ) -> Result<()>;

    // Perform any pre-action logic.
    fn pre_action<'info>(
        &self,
        _promisee: &Pubkey,
        _ctx: &Context<InitializePromise<'info>>,
        _evaluation_context: &mut EvaluationContext,
    ) -> Result<()> {
        Ok(())
    }

    // Perform any post-action logic.
    fn post_action<'info>(
        &self,
        _promisee: &Pubkey,
        _ctx: &Context<InitializePromise<'info>>,
        _evaluation_context: &mut EvaluationContext,
    ) -> Result<()> {
        Ok(())
    }
}

pub trait Rule: Condition + AnchorSerialize + AnchorDeserialize {
    /// Returns the number of bytes used by the guard configuration.
    fn size() -> usize;
}

pub struct EvaluationContext<'a> {
    /// The cursor for the remaining account list. When a rules "consumes" one of the
    /// remaining accounts, it should increment the cursor.
    pub account_cursor: usize,
    /// Convenience mapping of remaining account indices.
    pub indices: BTreeMap<&'a str, usize>,
}
