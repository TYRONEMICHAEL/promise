import { PublicKey } from "@solana/web3.js";

export type Promisor = {
  address: PublicKey;
  owner: PublicKey;
  network: PublicKey;
  state: PromisorState;
  numberOfPromises: number;
  // updatedAt: Date;
};

export enum PromisorState {
  active,
  inactive,
}

export const toPromisorState = (state: any) => {
  if (state["active"] != null) {
    return PromisorState.active;
  } else {
    return PromisorState.inactive;
  }
};

export const fromPromisorState = (state: PromisorState) => {
  switch (state) {
    case PromisorState.active:
      return { active: {} };
    case PromisorState.inactive:
      return { inActive: {} };
  }
};

export const createPromisorSeeds = (
  network: PublicKey,
  owner: PublicKey
): Buffer[] => {
  return [Buffer.from("promisor"), network.toBuffer(), owner.toBuffer()];
};
