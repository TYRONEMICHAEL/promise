import { GetProgramAccountsFilter } from "@solana/web3.js";

export enum PromiseField {
  id = 8 + 1, // bump
  network = 8 +
    1 + // bump
    4, // id
  promisor = 8 +
    1 + // bump
    4 + // id
    32, // network
  state = 8 +
    1 + // bump
    4 + // id
    32 + // network
    32, // promisor
}

export type PromiseFilter = {
  field: PromiseField;
  value: string;
};

export const fromPromiseFilter = (
  filter?: PromiseFilter
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
