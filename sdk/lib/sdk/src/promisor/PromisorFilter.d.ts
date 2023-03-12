import { GetProgramAccountsFilter } from "@solana/web3.js";
export declare enum PromisorField {
    owner = 9,
    network = 41,
    state = 73
}
export type PromisorFilter = {
    field: PromisorField;
    value: string;
};
export declare const fromPromisorFilter: (filter?: PromisorFilter) => GetProgramAccountsFilter[] | undefined;
