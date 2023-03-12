/// <reference types="node" />
import { PublicKey } from "@solana/web3.js";
import { PromisorState } from "./PromisorState";
/** Account that creates a Promise */
export type Promisor = {
    /** Public address to the Promisor */
    address: PublicKey;
    /** Public address of the Promisor/Owner */
    owner: PublicKey;
    /** Public address of the Network the Promisor belongs to */
    network: PublicKey;
    /** Current state of the Promisor */
    state: PromisorState;
    /** Number of Promises created by the Promisor */
    numberOfPromises: number;
    /** Date the Promisor was updated */
    updatedAt: Date;
};
export declare const createPromisorSeeds: (network: PublicKey, owner: PublicKey) => Buffer[];
