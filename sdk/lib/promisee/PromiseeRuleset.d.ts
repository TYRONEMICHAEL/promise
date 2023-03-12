/// <reference types="node" />
import { RulesetDate } from "../rules/RulsetDate";
import { SolGate } from "../rules/SolGate";
export declare class PromiseeRuleset {
    endDate?: RulesetDate;
    solWager?: SolGate;
    constructor(endDate?: RulesetDate, solWager?: SolGate);
    static fromData(data: Uint8Array | Buffer): PromiseeRuleset;
    toData(): Buffer;
}
