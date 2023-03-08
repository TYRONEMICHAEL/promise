import { PublicKey } from "@solana/web3.js";
import { BN } from "@project-serum/anchor";
import { PromiseeRuleset } from "../promisee/PromiseeRuleset";
import { PromisorRuleset } from "../promisor/PromisorRuleset";
import { PromiseState } from "./PromiseState";

/** Representation of a Promise */
export type PromiseProtocol = {
  /** Unique number for the Promise */
  id: number;

  /** Public address of the Promise */
  address: PublicKey;

  /** Public address of the Network */
  network: PublicKey;

  /** Public address of the Promisor */
  promisor: PublicKey;

  /** Current state of the Promise */
  state: PromiseState;

  /** Rules for the Promisees */
  promiseeRuleset: PromiseeRuleset;

  /** Rules for the Promisor */
  promisorRuleset: PromisorRuleset;

  /** Date the Promise was updated */
  updatedAt: Date;

  /** Date the Promise was created */
  createdAt: Date;

  /** Number of Promisees for the Promise */
  numberOfPromisees: number;
};

export const createPromiseSeeds = (
  network: PublicKey,
  promisor: PublicKey,
  id: number
): Buffer[] => {
  return [
    Buffer.from("promise"),
    network.toBuffer(),
    promisor.toBuffer(),
    new BN(id).toArrayLike(Buffer, "le", 4),
  ];
};
