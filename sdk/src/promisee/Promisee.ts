import { PublicKey } from "@solana/web3.js";

export type Promisee = {
  /** Public address of the Promisee */
  address: PublicKey;

  /** Bump of the Promisee */
  bump: Number;

  /** Public address of the owner of the Promisee */
  owner: PublicKey;

  /** Public address of the creator of the Promisee */
  creator: PublicKey;

  /** Public address of the Promise */
  promise: PublicKey;

  /** Date the Promisee was created */
  createdAt: Date;

  /** Date the Promisee was updated */
  updatedAt: Date;
};

export const createPromiseeSeeds = (
  promise: PublicKey,
  owner: PublicKey
): Buffer[] => {
  return [Buffer.from("promisee"), promise.toBuffer(), owner.toBuffer()];
};
