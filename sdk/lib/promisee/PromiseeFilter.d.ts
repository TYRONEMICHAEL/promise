import { GetProgramAccountsFilter } from "@solana/web3.js";
export declare enum PromiseeField {
    owner = 9,
    creator = 41,
    promise = 73
}
export type PromiseeFilter = {
    field: PromiseeField;
    value: string;
};
export declare const fromPromiseeFilter: (filter?: PromiseeFilter) => GetProgramAccountsFilter[] | undefined;
