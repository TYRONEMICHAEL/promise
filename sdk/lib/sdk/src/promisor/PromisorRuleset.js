"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromisorRuleset = void 0;
const borsh_1 = require("@dao-xyz/borsh");
const SolGate_1 = require("../rules/SolGate");
class PromisorRuleset {
    constructor(solReward) {
        this.solReward = solReward;
    }
    static fromData(data) {
        return (0, borsh_1.deserialize)(Buffer.from(data), PromisorRuleset);
    }
    toData() {
        return Buffer.from((0, borsh_1.serialize)(this));
    }
}
__decorate([
    (0, borsh_1.field)({ type: (0, borsh_1.option)(SolGate_1.SolGate) })
], PromisorRuleset.prototype, "solReward", void 0);
exports.PromisorRuleset = PromisorRuleset;
