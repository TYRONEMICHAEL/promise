use crate::promisor_ruleset::Condition;
use crate::promisor_ruleset::{Rule as PromsorRule, SolReward};
use anchor_lang::prelude::*;
use promise_ruleset_derive::Ruleset;

#[derive(Ruleset, AnchorSerialize, AnchorDeserialize, Clone, Debug)]
pub struct PromisorRules {
    /// End date rule (controls when a promisor account is created).
    pub sol_reward: Option<SolReward>,
}
