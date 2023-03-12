"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromiseeRuleset = void 0;
const borsh_1 = require("@dao-xyz/borsh");
const RulsetDate_1 = require("../rules/RulsetDate");
const SolGate_1 = require("../rules/SolGate");
class PromiseeRuleset {
    constructor(endDate, solWager) {
        this.endDate = endDate;
        this.solWager = solWager;
    }
    static fromData(data) {
        return (0, borsh_1.deserialize)(Buffer.from(data), PromiseeRuleset);
    }
    toData() {
        return Buffer.from((0, borsh_1.serialize)(this));
    }
}
__decorate([
    (0, borsh_1.field)({ type: (0, borsh_1.option)(RulsetDate_1.RulesetDate) })
], PromiseeRuleset.prototype, "endDate", void 0);
__decorate([
    (0, borsh_1.field)({ type: (0, borsh_1.option)(SolGate_1.SolGate) })
], PromiseeRuleset.prototype, "solWager", void 0);
exports.PromiseeRuleset = PromiseeRuleset;
