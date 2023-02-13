use super::*;

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug)]
pub struct SolWager {
    pub amount: i64,
}

impl Rule for SolWager {
    fn size() -> usize {
        32 // Pubkey
    }
}

impl Condition for SolWager {
    fn validate<'info>(
        &self,
        _promisee: &Pubkey,
        _ctx: &Context<InitializePromise>,
        _evaluation_context: &mut EvaluationContext,
    ) -> Result<()> {
        // TODO: Check for required lamports.
        Ok(())
    }
}
