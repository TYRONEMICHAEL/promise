"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPromisorSeeds = void 0;
const createPromisorSeeds = (network, owner) => {
    return [Buffer.from("promisor"), network.toBuffer(), owner.toBuffer()];
};
exports.createPromisorSeeds = createPromisorSeeds;
