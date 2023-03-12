import { GetProgramAccountsFilter } from "@solana/web3.js";
export declare enum PromiseField {
    id = 9,
    network = 13,
    promisor = 45,
    state = 77
}
export type PromiseFilter = {
    field: PromiseField;
    value: string;
};
export declare const fromPromiseFilter: (filter?: PromiseFilter) => GetProgramAccountsFilter[] | undefined;
