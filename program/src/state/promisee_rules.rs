use crate::promisee_ruleset::{Condition, PromiseEndDate as EndDate, SolWager};
use crate::promisee_ruleset::{Rule as PromiseeRule};
use anchor_lang::prelude::*;
use promise_ruleset_derive::Ruleset;

#[derive(Ruleset, AnchorSerialize, AnchorDeserialize, Clone, Debug)]
pub struct PromiseeRules {
    /// End date rule (controls when a promisor account is created).
    pub end_date: Option<EndDate>,
    /// Allow for wagers to be created
    pub sol_wager: Option<SolWager>,
}
