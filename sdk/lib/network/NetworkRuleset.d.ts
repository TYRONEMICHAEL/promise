/// <reference types="node" />
import { RulesetDate } from "../rules/RulsetDate";
import { NftGate } from "../rules/NftGate";
export declare class NetworkRuleset {
    startDate?: RulesetDate;
    endDate?: RulesetDate;
    nftGate?: NftGate;
    constructor(startDate?: RulesetDate, endDate?: RulesetDate, nftGate?: NftGate);
    static fromData(data: Uint8Array | Buffer): NetworkRuleset;
    toData(): Buffer;
}
