use crate::{errors::PromiseError, utils::assert_keys_equal};

use super::*;

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug)]
pub struct SolReward {
    pub lamports: u64,
}

impl Rule for SolReward {
    fn size() -> usize {
        8
    }
}

impl Condition for SolReward {
    fn validate<'info>(
        &self,
        promisor: &Account<Promisor>,
        _promise: &Account<Promise>,
        remaining_accounts: &[AccountInfo],
        _evaluation_context: &mut EvaluationContext,
    ) -> Result<()> {
        if remaining_accounts.is_empty() {
            return err!(PromiseError::NotEnoughAccounts);
        }
        let promisor_owner = remaining_accounts[0].clone();
        assert_keys_equal(&promisor.owner, &promisor_owner.key())?;
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
