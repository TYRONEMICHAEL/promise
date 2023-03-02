use std::collections::BTreeMap;
mod promise_end_date;

pub use anchor_lang::prelude::*;
pub use promise_end_date::PromiseEndDate;

use crate::{state::{Promisee, Promise}};

pub trait Condition {
    // Validate the inputs pass the condition.
    fn validate<'c, 'info>(
        &self,
        promisee: &Account<Promisee>,
        promise: &Account<'info, Promise>,
        remaining_accounts: &'c [AccountInfo<'info>],
        evaluation_context: &mut EvaluationContext,
    ) -> Result<()>;

    // Perform any pre-action logic.
    fn pre_action<'c, 'info>(
        &self,
        _promisee: &Account<Promisee>,
        _promise: &Account<'info, Promise>,
        _remaining_accounts: &'c [AccountInfo<'info>],
        _evaluation_context: &mut EvaluationContext,
    ) -> Result<()> {
        Ok(())
    }

    // Perform any post-action logic.
    fn post_action<'c, 'info>(
        &self,
        _promisee: &Account<Promisee>,
        _promise: &Account<'info, Promise>,
        _remaining_accounts: &'c [AccountInfo<'info>],
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
