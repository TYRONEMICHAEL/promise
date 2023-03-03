import { PublicKey } from "@solana/web3.js";

export type Promisee = {
  address: PublicKey;
  owner: PublicKey;
  promise: PublicKey;
  createdAt: Date;
  updatedAt: Date;
  bump: Number;
};

export const createPromiseeSeeds = (
  promise: PublicKey,
  owner: PublicKey
): Buffer[] => {
  return [Buffer.from("promisee"), promise.toBuffer(), owner.toBuffer()];
};
