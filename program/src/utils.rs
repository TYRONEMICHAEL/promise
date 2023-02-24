use anchor_lang::prelude::*;
use anchor_lang::{
    prelude::{AccountInfo, Pubkey},
    solana_program::{program_memory::sol_memcmp, pubkey::PUBKEY_BYTES},
};
use anchor_spl::token::spl_token;
use mpl_token_metadata::utils::assert_initialized;

use crate::errors::PromiseError;

pub fn assert_owned_by(account: &AccountInfo, owner: &Pubkey) -> Result<()> {
    if !cmp_pubkeys(account.owner, owner) {
        err!(PromiseError::IncorrectOwner)
    } else {
        Ok(())
    }
}

pub fn cmp_pubkeys(a: &Pubkey, b: &Pubkey) -> bool {
    sol_memcmp(a.as_ref(), b.as_ref(), PUBKEY_BYTES) == 0
}

pub fn assert_keys_equal(key1: &Pubkey, key2: &Pubkey) -> Result<()> {
    if !cmp_pubkeys(key1, key2) {
        err!(PromiseError::PublicKeyMismatch)
    } else {
        Ok(())
    }
}

pub fn assert_is_token_account(
    ta: &AccountInfo,
    wallet: &Pubkey,
    mint: &Pubkey,
) -> core::result::Result<spl_token::state::Account, ProgramError> {
    assert_owned_by(ta, &spl_token::id())?;
    let token_account: spl_token::state::Account = assert_initialized(ta)?;
    assert_keys_equal(&token_account.owner, wallet)?;
    assert_keys_equal(&token_account.mint, mint)?;
    Ok(token_account)
}

pub fn try_get_account_info<'c, 'info, T>(
    remaining_accounts: &'c [AccountInfo<'info>],
    index: usize,
) -> Result<&'c AccountInfo<'info>> {
    if index < remaining_accounts.len() {
        Ok(&remaining_accounts[index])
    } else {
        err!(PromiseError::NotEnoughAccounts)
    }
}
