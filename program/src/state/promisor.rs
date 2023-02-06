use anchor_lang::prelude::*;

#[derive(Clone, Debug, PartialEq, Eq, AnchorSerialize, AnchorDeserialize)]
#[repr(u8)]
pub enum PromisorState {
    /// The promisor account is active. Only the network can set this state.
    Active = 0,
    /// The promisor account is inactive. Only the network can set this state.
    InActive = 1,
}

#[account]
pub struct Promisor {
    // Bump seed
    pub bump: u8,
    // The owner of this account
    pub owner: Pubkey,
    // The promise network this account belongs to
    pub promise_network: Pubkey,
    // The state of this account
    pub state: PromisorState,
    // The last time this account was updated
    pub updated_at: i64,
    // The number of promises this promisor has made
    // Will be used for seed generation
    pub num_promises: i32,
}

impl Promisor {
    pub const SEED_PREFIX: &'static [u8] = b"promisor";
    pub const SIZE: usize = 8 +
    8 + // bump
    32 + // owner
    32 + // promise_network
    1 + // state
    8 + // updated_at
    4; // num_promises
}
