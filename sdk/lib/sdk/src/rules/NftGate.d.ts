import { PublicKey } from "@solana/web3.js";
export declare class NftGate {
    requiredCollection: Uint8Array;
    constructor(requiredCollection: Uint8Array);
    static fromPublicKey(publicKey: PublicKey): NftGate;
}
