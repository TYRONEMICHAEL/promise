import { deserialize, field, option, serialize } from "@dao-xyz/borsh";
import { RulesetDate } from "../rules/RulsetDate";
import { NftGate } from "../rules/NftGate";

export class NetworkRuleset {
  @field({ type: option(RulesetDate) })
  startDate?: RulesetDate;

  @field({ type: option(RulesetDate) })
  endDate?: RulesetDate;

  @field({ type: option(NftGate) })
  nftGate?: NftGate;

  public constructor(
    startDate?: RulesetDate,
    endDate?: RulesetDate,
    nftGate?: NftGate
  ) {
    this.startDate = startDate;
    this.endDate = endDate;
    this.nftGate = nftGate;
  }

  public static fromData(data: Uint8Array | Buffer): NetworkRuleset {
    return deserialize(Buffer.from(data), NetworkRuleset);
  }

  public toData(): Buffer {
    return Buffer.from(serialize(this))
  }
}
