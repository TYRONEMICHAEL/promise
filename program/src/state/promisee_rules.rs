use crate::promisee_ruleset::{Condition, PromiseEndDate as EndDate};
use crate::promisee_ruleset::{Rule as PromiseeRule, SolWager};
use anchor_lang::prelude::*;
use promise_ruleset_derive::Ruleset;

#[derive(Ruleset, AnchorSerialize, AnchorDeserialize, Clone, Debug)]
pub struct PromiseeRules {
    /// What the wager is
    pub sol_wager: Option<SolWager>,
    /// End date rule (controls when a promisor account is created).
    pub end_date: Option<EndDate>,
}
