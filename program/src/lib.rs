pub mod errors;
pub mod instructions;
pub mod ruleset;
pub mod state;
pub mod utils;

use anchor_lang::prelude::*;
use instructions::*;
use state::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod promise {
    use super::*;

    pub fn initialize_network(
        ctx: Context<InitializeNetwork>,
        data: Vec<u8>,
        bump: u8,
    ) -> Result<()> {
        instructions::initialize_network(ctx, data, bump)
    }

    pub fn update_network(ctx: Context<UpdateNetwork>, data: Vec<u8>) -> Result<()> {
        instructions::update_network(ctx, data)
    }

    pub fn initialize_promisor<'info>(ctx: Context<InitializePromisor>, bump: u8) -> Result<()> {
        instructions::initialize_promisor(ctx, bump)
    }

    pub fn update_promisor<'info>(
        ctx: Context<UpdatePromisor>,
        state: PromisorState,
    ) -> Result<()> {
        instructions::update_promisor(ctx, state)
    }
}
