use anchor_lang::prelude::*;
use promise_ruleset_derive::Ruleset;
use crate::ruleset::{StartDate, EndDate, Condition, Rule, NftGate};

#[account]
#[derive(Default)]
pub struct Promise {
    // Bump seed
    pub bump: u8,
    // Network authority
    pub network: Pubkey,
    // Promisor account
    pub promisor: Pubkey,
    // Promisee account
    pub promisee: Pubkey,
    // List of rules
    pub data: Vec<u8>,
}

#[derive(Ruleset, AnchorSerialize, AnchorDeserialize, Clone, Debug)]
pub struct Rules {
    /// Start date rule 
    pub start_date: Option<StartDate>,
    /// End date rule 
    pub end_date: Option<EndDate>,
    /// Gated access only
    pub nft_gate: Option<NftGate>,
}

impl Promise {
    pub const SEED_PREFIX: &'static [u8] = b"promise";
    pub const DATA_OFFSET: usize = 8 + 8 + 1 + 32;

    pub fn account_size(&self) -> usize {
        let mut size = Promise::DATA_OFFSET;
        size += self.data.len(); // data
        size
    }
}