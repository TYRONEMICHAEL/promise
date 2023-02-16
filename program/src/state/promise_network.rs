use crate::network_ruleset::{Condition, EndDate, NftGate, Rule, StartDate};
use anchor_lang::prelude::*;
use promise_ruleset_derive::Ruleset;

#[account]
#[derive(Default)]
pub struct PromiseNetwork {
    // Bump seed
    pub bump: u8,
    // Network authority
    pub authority: Pubkey,
    // List of guards
    pub data: Vec<u8>,
}

#[derive(Ruleset, AnchorSerialize, AnchorDeserialize, Clone, Debug)]
pub struct NetworkRules {
    /// Start date rule (controls when a promisor account is created).
    pub start_date: Option<StartDate>,
    /// End date rule (controls when a promisor account is created).
    pub end_date: Option<EndDate>,
    /// End date rule (controls when a promisor account is created).
    pub nft_gate: Option<NftGate>,
}

impl PromiseNetwork {
    pub const SEED_PREFIX: &'static [u8] = b"promise_network";
    pub const DATA_OFFSET: usize = 8 + 8 + 1 + 32;

    pub fn account_size(&self) -> usize {
        let mut size = PromiseNetwork::DATA_OFFSET;
        size += self.data.len(); // data
        size
    }
}
