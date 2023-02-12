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
    // Network authority
    pub network: Pubkey,
    // Promisor account
    pub promisor: Pubkey,
    // Promist state
    pub state: PromiseState,
    // List of rules
    pub data: Vec<u8>,
    // The last time this promise was updated
    pub updated_at: i64,
    // The created date for the promise
    pub created_at: i64,
    // The end date for the promise
    pub ends_at: i64,
    // The number of promises this promisor has made
    pub num_promises: i32,
}

impl Promise {
    pub const SEED_PREFIX: &'static [u8] = b"promise";
    pub const DATA_OFFSET: usize = 8 +
    8 + // bump
    32 + // network
    32 + // promisor
    1 + // state
    8 + // updated_at
    8 + // created_at
    8 + // ends_at
    4; // num_promises

    pub fn account_size(&self) -> usize {
        let mut size = Promise::DATA_OFFSET;
        size += self.data.len(); // data
        size
    }
}
