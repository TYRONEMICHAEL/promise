import { deserialize, field, option, serialize } from "@dao-xyz/borsh";
import { RulesetDate } from "./rulesets/RulsetDate";
import { SolGate } from "./rulesets/SolGate";

export class PromiseeRuleset {
  @field({ type: option(SolGate) })
  solWager: SolGate;

  @field({ type: option(RulesetDate) })
  endDate: RulesetDate;

  public constructor(solWager?: SolGate) {
    this.solWager = solWager;
  }

  public static fromData(data: Uint8Array | Buffer): PromiseeRuleset {
    return deserialize(data, PromiseeRuleset);
  }

  public toData(): Buffer {
    return serialize(this) as Buffer;
  }
}
