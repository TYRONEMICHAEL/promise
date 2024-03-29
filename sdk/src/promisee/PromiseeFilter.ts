import { GetProgramAccountsFilter } from "@solana/web3.js";

export enum PromiseeField {
  owner = 8 + 1, // bump
  creator = 8 +
    1 + // bump
    32, // owner
  promise = 8 +
    1 + // bump
    32 + // owner
    32, // creator
}

export type PromiseeFilter = {
  field: PromiseeField;
  value: string;
};

export const fromPromiseeFilter = (
  filter?: PromiseeFilter
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
