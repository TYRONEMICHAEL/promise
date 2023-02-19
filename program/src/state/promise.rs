use anchor_lang::prelude::*;

#[derive(Clone, Debug, PartialEq, Eq, AnchorSerialize, AnchorDeserialize)]
#[repr(u8)]
pub enum PromiseState {
    /// The promise has been created
    Created = 0,
    /// The promise is now active
    Active = 1,
    /// The promise is now completed
    Completed = 2,
    /// The promise is now voided
    Voided = 3,
}

#[account]
pub struct Promise {
    // Bump seed
    pub bump: u8,
    // Promise id
    pub id: i32,
    // Network authority
    pub network: Pubkey,
    // Promisor account
    pub promisor: Pubkey,
    // Promist state
    pub state: PromiseState,
    // List of rules for the promisee
    pub promisee_data: Vec<u8>,
    // List of rules for the promisor
    pub promisor_data: Vec<u8>,
    // The last time this promise was updated
    pub updated_at: i64,
    // The created date for the promise
    pub created_at: i64,
    // The number of promisees that have accepted this promise
    pub num_promisees: i32,
}

impl Promise {
    pub const SEED_PREFIX: &'static [u8] = b"promise";
    // TODO: Check the OFFSETS
    // Usually if the account cannot serialize it is because the offsets are wrong
    pub const DATA_OFFSET: usize = 8 + 8 + 8 +
    8 + // bump
    32 + // network
    32 + // promisor
    1 + // state
    8 + // updated_at
    8 + // created_at
    4; // num_promises

    pub fn account_size(&self) -> usize {
        let mut size = Promise::DATA_OFFSET;
        size += self.promisee_data.len(); // data
        size += self.promisor_data.len(); // data
        size
    }
}
