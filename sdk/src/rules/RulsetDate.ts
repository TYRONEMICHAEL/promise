import { field } from "@dao-xyz/borsh";

export class RulesetDate {
  @field({ type: "u64" })
  date: number;

  constructor(date: number) {
    this.date = date;
  }

  public static fromDate(date: Date): RulesetDate {
    return new RulesetDate(Math.floor(date.getTime() / 1000));
  }
}
