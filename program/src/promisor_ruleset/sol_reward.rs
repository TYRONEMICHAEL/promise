use super::*;

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug)]
pub struct SolReward {
    pub amount: i64,
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
        _ctx: &Context<InitializePromise>,
        _evaluation_context: &mut EvaluationContext,
    ) -> Result<()> {
        Ok(())
    }
}
