import { PublicKey } from "@solana/web3.js";
import { PromisorState } from "./PromisorState";

export type Promisor = {
  address: PublicKey;
  owner: PublicKey;
  network: PublicKey;
  state: PromisorState;
  numberOfPromises: number;
  // updatedAt: Date;
};

export const createPromisorSeeds = (
  network: PublicKey,
  owner: PublicKey
): Buffer[] => {
  return [Buffer.from("promisor"), network.toBuffer(), owner.toBuffer()];
};
