import { deserialize, field, option, serialize } from "@dao-xyz/borsh";
import { SolGate } from "../rules/SolGate";

export class PromisorRuleset {
  @field({ type: option(SolGate) })
  solReward?: SolGate;

  public constructor(solReward?: SolGate) {
    this.solReward = solReward;
  }

  public static fromData(data: Uint8Array | Buffer): PromisorRuleset {
    return deserialize(Buffer.from(data), PromisorRuleset);
  }

  public toData(): Buffer {
    return Buffer.from(serialize(this));
  }
}
