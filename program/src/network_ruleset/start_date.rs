use crate::errors::PromiseError;

use super::*;

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug)]
pub struct StartDate {
    pub date: u64,
}

impl Rule for StartDate {
    fn size() -> usize {
        8 // date
    }
}

impl Condition for StartDate {
    fn validate<'info>(
        &self,
        _ctx: &Context<'_, '_, '_, 'info, InitializePromisor>,
        _evaluation_context: &mut EvaluationContext,
    ) -> Result<()> {
        let clock = Clock::get()?;
        if clock.unix_timestamp < self.date.try_into().unwrap() {
            return err!(PromiseError::PromisorAccountCreationNotLive);
        }

        Ok(())
    }
}
