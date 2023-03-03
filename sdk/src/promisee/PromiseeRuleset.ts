import { deserialize, field, option, serialize } from "@dao-xyz/borsh";
import { RulesetDate } from "../rules/RulsetDate";
import { SolGate } from "../rules/SolGate";

export class PromiseeRuleset {
  @field({ type: option(RulesetDate) })
  endDate?: RulesetDate;

  public constructor(endDate?: RulesetDate) {
    this.endDate = endDate;
  }

  public static fromData(data: Uint8Array | Buffer): PromiseeRuleset {
    return deserialize(Buffer.from(data), PromiseeRuleset);
  }

  public toData(): Buffer {
    return Buffer.from(serialize(this));
  }
}
