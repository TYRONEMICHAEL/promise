import { field, fixedArray } from "@dao-xyz/borsh";
import { PublicKey } from "@solana/web3.js";

export class NftGate {
  @field({ type: fixedArray("u8", 32) })
  requiredCollection: Uint8Array;

  constructor(requiredCollection: Uint8Array) {
    this.requiredCollection = requiredCollection;
  }

  public static fromPublicKey(publicKey: PublicKey): NftGate {
    return new NftGate(publicKey.toBytes());
  }
}
