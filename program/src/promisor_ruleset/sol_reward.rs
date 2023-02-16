use crate::errors::PromiseError;

use super::*;

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug)]
pub struct SolReward {
    pub lamports: u64,
}

impl Rule for SolReward {
    fn size() -> usize {
        8 + // Amount
        32 // Pubkey
    }
}

impl Condition for SolReward {
    fn validate<'info>(
        &self,
        ctx: &Context<InitializePromise>,
        _evaluation_context: &mut EvaluationContext,
    ) -> Result<()> {
        let promisor_owner = &ctx.accounts.promisor_owner;
        if promisor_owner.lamports() < self.lamports {
            msg!(
                "Require {} lamports, accounts has {} lamports",
                self.lamports,
                promisor_owner.lamports(),
            );
            return err!(PromiseError::NotEnoughSOL);
        }
        Ok(())
    }
}
