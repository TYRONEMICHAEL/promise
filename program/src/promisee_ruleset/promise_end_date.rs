use crate::errors::PromiseError;

use super::*;

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug)]
pub struct PromiseEndDate {
    pub date: i64,
}

impl Rule for PromiseEndDate {
    fn size() -> usize {
        8 // date
    }
}

impl Condition for PromiseEndDate {
    fn validate<'c, 'info>(
        &self,
        _promisee: &Account<Promisee>,
        _promise: &Account<'info, Promise>,
        _remaining_accounts: &'c [AccountInfo<'info>],
        _evaluation_context: &mut EvaluationContext,
    ) -> Result<()> {
        let clock = Clock::get()?;
        if clock.unix_timestamp >= self.date {
            return err!(PromiseError::PromiseeCannotAccept);
        }

        Ok(())
    }
}
