"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NetworkRuleset = void 0;
const borsh_1 = require("@dao-xyz/borsh");
const RulsetDate_1 = require("../rules/RulsetDate");
const NftGate_1 = require("../rules/NftGate");
class NetworkRuleset {
    constructor(startDate, endDate, nftGate) {
        this.startDate = startDate;
        this.endDate = endDate;
        this.nftGate = nftGate;
    }
    static fromData(data) {
        return (0, borsh_1.deserialize)(Buffer.from(data), NetworkRuleset);
    }
    toData() {
        return Buffer.from((0, borsh_1.serialize)(this));
    }
}
__decorate([
    (0, borsh_1.field)({ type: (0, borsh_1.option)(RulsetDate_1.RulesetDate) })
], NetworkRuleset.prototype, "startDate", void 0);
__decorate([
    (0, borsh_1.field)({ type: (0, borsh_1.option)(RulsetDate_1.RulesetDate) })
], NetworkRuleset.prototype, "endDate", void 0);
__decorate([
    (0, borsh_1.field)({ type: (0, borsh_1.option)(NftGate_1.NftGate) })
], NetworkRuleset.prototype, "nftGate", void 0);
exports.NetworkRuleset = NetworkRuleset;
