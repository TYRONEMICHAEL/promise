import { deserialize, field, option, serialize } from "@dao-xyz/borsh";
import { RulesetDate } from "./rulesets/RulsetDate";
import { SolGate } from "./rulesets/SolGate";

export class PromisorRuleset {
  @field({ type: option(SolGate) })
  solReward: SolGate;

  public constructor(solReward?: SolGate) {
    this.solReward = solReward;
  }

  public static fromData(data: Uint8Array | Buffer): PromisorRuleset {
    return deserialize(data, PromisorRuleset);
  }

  public toData(): Buffer {
    return serialize(this) as Buffer;
  }
}
