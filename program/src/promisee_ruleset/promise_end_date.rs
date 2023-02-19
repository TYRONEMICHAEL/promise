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
    fn validate<'info>(
        &self,
        _promisee: &Pubkey,
        _ctx: &Context<InitializePromise>,
        _evaluation_context: &mut EvaluationContext,
    ) -> Result<()> {
        let clock = Clock::get()?;
        if clock.unix_timestamp >= self.date {
            return err!(PromiseError::PromiseExpired);
        }

        Ok(())
    }
}
