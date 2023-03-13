/// <reference types="node" />
import { PublicKey } from "@solana/web3.js";
export type Promisee = {
    address: PublicKey;
    bump: Number;
    owner: PublicKey;
    creator: PublicKey;
    promise: PublicKey;
    createdAt: Date;
    updatedAt: Date;
};
export declare const createPromiseeSeeds: (promise: PublicKey, owner: PublicKey) => Buffer[];
