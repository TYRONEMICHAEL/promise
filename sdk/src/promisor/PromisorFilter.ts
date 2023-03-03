import { GetProgramAccountsFilter } from "@solana/web3.js";

/*
pub struct Promisor {
    // Bump seed
    pub bump: u8,
    // The owner of this account
    pub owner: Pubkey,
    // The promise network this account belongs to
    pub promise_network: Pubkey,
    // The state of this account
    pub state: PromisorState,
    // The last time this account was updated
    pub created_at: i64,
    // The last time this account was updated
    pub updated_at: i64,
    // The number of promises this promisor has made
    // Will be used for seed generation
    pub num_promises: i32,
}
*/

export enum PromisorField {
  owner = 8 + 1, // bump
  network = 8 +
    1 + // bump
    32, // owner
  state = 8 +
    1 + // bump
    32 + // owner
    32, // network
}

export type PromisorFilter = {
  field: PromisorField;
  value: string;
};

export const fromPromisorFilter = (
  filter?: PromisorFilter
): GetProgramAccountsFilter[] | undefined => {
  if (filter == null || filter == undefined) {
    return undefined;
  }

  return [
    {
      memcmp: {
        offset: filter.field.valueOf(),
        bytes: filter.value,
      },
    },
  ];
};
