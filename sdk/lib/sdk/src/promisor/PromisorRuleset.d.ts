/// <reference types="node" />
import { SolGate } from "../rules/SolGate";
export declare class PromisorRuleset {
    solReward?: SolGate;
    constructor(solReward?: SolGate);
    static fromData(data: Uint8Array | Buffer): PromisorRuleset;
    toData(): Buffer;
}
