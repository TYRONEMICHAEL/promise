import { PublicKey } from "@solana/web3.js";
import { NetworkRuleset } from "./NetworkRuleset";

export type Network = {
  address: PublicKey;
  createdBy: PublicKey;
  ruleset: NetworkRuleset;
  bump: number;
};

export const createNetworkSeeds = (authority: PublicKey): Buffer[] => {
  return [Buffer.from("promise_network"), authority.toBuffer()];
};
