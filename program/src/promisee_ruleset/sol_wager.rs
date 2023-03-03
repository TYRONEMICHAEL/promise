use anchor_lang::solana_program::{system_instruction, program::invoke};

use crate::{errors::PromiseError, utils::{assert_keys_equal, try_get_account_info}};

use super::*;

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug)]
pub struct SolWager {
    pub lamports: u64,
}

impl Rule for SolWager {
    fn size() -> usize {
        8
    }
}

impl Condition for SolWager {
    fn validate<'c, 'info>(
        &self,
        promisee: &Account<Promisee>,
        _promise: &Account<Promise>,
        remaining_accounts: &[AccountInfo],
        evaluation_context: &mut EvaluationContext,
    ) -> Result<()> {
        let index = evaluation_context.account_cursor;
        let promisee_owner = try_get_account_info::<AccountInfo>(&remaining_accounts, index)?;
        assert_keys_equal(&promisee.owner.key(), &promisee_owner.key())?;

        evaluation_context.account_cursor += 2;

        if promisee_owner.lamports() < self.lamports {
            msg!(
                "Require {} lamports, accounts has {} lamports",
                self.lamports,
                promisee_owner.lamports(),
            );
            return err!(PromiseError::NotEnoughSOL);
        }
        Ok(())
    }

    fn pre_action<'c, 'info>(
        &self,
        promisee: &Account<Promisee>,
        promise: &Account<'info, Promise>,
        remaining_accounts: &'c [AccountInfo<'info>],
        evaluation_context: &mut EvaluationContext,
    ) -> Result<()> {
        let index = evaluation_context.account_cursor;
        let promisee_owner = &remaining_accounts[index];
        let system_account = &remaining_accounts[index + 1];

        evaluation_context.account_cursor += 2;

        assert_keys_equal(&promisee.owner.key(), &promisee_owner.key())?;

        msg!("Transferring {} lamports to {}", self.lamports, promise.key());

        invoke(
            &system_instruction::transfer(
                &promisee_owner.key(),
                &promise.key(),
                self.lamports,
            ),
            &[
                promisee_owner.to_account_info(),
                promise.to_account_info(),
                system_account.to_account_info(),
            ],
        )?;

        Ok(())
    }

    fn post_action<'c, 'info>(
        &self,
        _promisee: &Account<Promisee>,
        promise: &Account<'info, Promise>,
        remaining_accounts: &'c [AccountInfo<'info>],
        evaluation_context: &mut EvaluationContext,
    ) -> Result<()> {
        let index = evaluation_context.account_cursor;
        let to_account = &remaining_accounts[index];
        let lamports = self.lamports * promise.num_promisees as u64;
        evaluation_context.account_cursor += 1;

        msg!("Transferring {} lamports to {}", lamports, to_account.key());

        **promise.to_account_info().try_borrow_mut_lamports()? -= lamports;
        **to_account.try_borrow_mut_lamports()? += lamports;

        Ok(())
    }

}
