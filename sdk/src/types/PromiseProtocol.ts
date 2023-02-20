import { PublicKey } from "@solana/web3.js";
import { BN } from "@project-serum/anchor";
import { PromiseeRuleset } from "./PromiseeRuleset";
import { PromisorRuleset } from "./PromisorRuleset";
import { PromiseState } from "./PromiseState";

export type PromiseProtocol = {
  id: number;
  address: PublicKey;
  network: PublicKey;
  promisor: PublicKey;
  state: PromiseState;
  promiseeRuleset: PromiseeRuleset;
  promisorRuleset: PromisorRuleset;
  // updatedAt: Date;
  // createdAt: Date;
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
