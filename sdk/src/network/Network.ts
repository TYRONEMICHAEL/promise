import { PublicKey } from "@solana/web3.js";
import { NetworkRuleset } from "./NetworkRuleset";

/** Faciliates Promisors to create Promises */
export type Network = {
  /** Public address to the Network */
  address: PublicKey;

  /** Public address of the creator of the Network */
  createdBy: PublicKey;
  
  /** Rules for the Network */
  ruleset: NetworkRuleset;
};

export const createNetworkSeeds = (authority: PublicKey): Buffer[] => {
  return [Buffer.from("promise_network"), authority.toBuffer()];
};
