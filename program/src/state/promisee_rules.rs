use anchor_lang::prelude::*;
use crate::promisee_ruleset::{Rule as PromiseeRule, SolWager};
use crate::promisee_ruleset::Condition;
use promise_ruleset_derive::Ruleset;

#[derive(Ruleset, AnchorSerialize, AnchorDeserialize, Clone, Debug)]
pub struct PromiseeRules {
    /// End date rule (controls when a promisor account is created).
    pub sol_wager: Option<SolWager>,
}