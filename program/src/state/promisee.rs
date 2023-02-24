use anchor_lang::prelude::*;

#[account]
pub struct Promisee {
    // Bump seed
    pub bump: u8,
    // The owner of this account
    pub owner: Pubkey,
    // The promise network this account belongs to
    pub promise_network: Pubkey,
    // The time this account was created
    pub created_at: i64,
    // The last time this account was updated
    pub updated_at: i64,
}

impl Promisee {
  pub const SEED_PREFIX: &'static [u8] = b"promisee";
  pub const SIZE: usize = 
    8 +
    8 + // bump
    32 + // owner
    32 + // promise_network
    8 + // created_at
    8; // updated_at
}
