use anchor_lang::solana_program::{system_instruction, program::invoke};

use crate::{errors::PromiseError, utils::{assert_keys_equal, try_get_account_info}};

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
    fn validate<'c, 'info>(
        &self,
        promisor: &Account<Promisor>,
        _promise: &Account<Promise>,
        remaining_accounts: &[AccountInfo],
        evaluation_context: &mut EvaluationContext,
    ) -> Result<()> {
        let index = evaluation_context.account_cursor;
        let promisor_owner = try_get_account_info::<AccountInfo>(&remaining_accounts, index)?;
        assert_keys_equal(&promisor.owner.key(), &promisor_owner.key())?;

        evaluation_context.account_cursor += 2;

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

    fn pre_action<'c, 'info>(
        &self,
        promisor: &Account<Promisor>,
        promise: &Account<'info, Promise>,
        remaining_accounts: &'c [AccountInfo<'info>],
        evaluation_context: &mut EvaluationContext,
    ) -> Result<()> {
        let index = evaluation_context.account_cursor;
        let from_account = &remaining_accounts[index];
        let system_account = &remaining_accounts[index + 1];

        evaluation_context.account_cursor += 2;

        assert_keys_equal(&promisor.owner.key(), &from_account.key())?;

        msg!("Transferring {} lamports to {}", self.lamports, promise.key());

        invoke(
            &system_instruction::transfer(
                &from_account.key(),
                &promise.key(),
                self.lamports,
            ),
            &[
                from_account.to_account_info(),
                promise.to_account_info(),
                system_account.to_account_info(),
            ],
        )?;

        Ok(())
    }

}
