import { field } from "@dao-xyz/borsh";

export class SolGate {
  @field({ type: "u64" })
  lamports: number;

  constructor(lamports: number) {
    this.lamports = lamports;
  }
}
