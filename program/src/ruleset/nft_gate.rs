use super::*;
use crate::{errors::PromiseError, utils::assert_is_token_account};
use mpl_token_metadata::state::{Metadata, TokenMetadataAccount};

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug)]
pub struct NftGate {
    pub required_collection: Pubkey,
}

impl Rule for NftGate {
    fn size() -> usize {
        32 // Pubkey
    }
}

impl Condition for NftGate {
    fn validate<'info>(
        &self,
        ctx: &Context<InitializePromisor>,
        evaluation_context: &mut EvaluationContext,
    ) -> Result<()> {
        if &ctx.remaining_accounts.len() < &2 {
            return err!(PromiseError::MissingRequiredNFT);
        }

        let nft_account = &ctx.remaining_accounts[0];
        let nft_mint = &ctx.remaining_accounts[1];
        evaluation_context.account_cursor += 2;

        let metadata = Metadata::from_account_info(nft_mint)?;

        match metadata.collection {
            Some(c) if c.verified && c.key == self.required_collection => Ok(()),
            _ => Err(PromiseError::MissingRequiredCollection),
        }?;

        let account =
            assert_is_token_account(nft_account, &ctx.accounts.owner.key(), &metadata.mint)?;

        if account.amount < 1 {
            return err!(PromiseError::MissingRequiredNFT);
        }

        Ok(())
    }
}
