use anchor_lang::prelude::*;

#[error_code]
pub enum PromiseError {
    #[msg("Account not initialized")]
    Uninitialized,
    #[msg("Network unable to create promisor account. Check network rules")]
    PromisorAccountCreationNotLive,
    #[msg("Network unable to create promisor account. Check network rules")]
    PromisorAccountCreationExpired,
    #[msg("Unable to deserialize ruleset")]
    DeserializationError,
    #[msg("Missing the required collection")]
    MissingRequiredCollection,
    #[msg("Incorrect owner")]
    IncorrectOwner,
    #[msg("Public key mismatch")]
    PublicKeyMismatch,
    #[msg("Missing the required NFT")]
    MissingRequiredNFT,
    #[msg("Promisor account not active")]
    PromisorNotActive,
    #[msg("Invalid promise state")]
    InvalidPromiseState,
}
