use crate::errors::PromiseError;

use super::*;

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug)]
pub struct EndDate {
    pub date: i64,
}

impl Rule for EndDate {
    fn size() -> usize {
        8 // date
    }
}

impl Condition for EndDate {
    fn validate<'info>(
        &self,
        _ctx: &Context<InitializePromisor>,
        _evaluation_context: &mut EvaluationContext,
    ) -> Result<()> {
        let clock = Clock::get()?;
        if clock.unix_timestamp >= self.date {
            return err!(PromiseError::PromisorAccountCreationExpired);
        }

        Ok(())
    }
}
