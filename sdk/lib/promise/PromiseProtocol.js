"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPromiseSeeds = void 0;
const anchor_1 = require("@project-serum/anchor");
const createPromiseSeeds = (network, promisor, id) => {
    return [
        Buffer.from("promise"),
        network.toBuffer(),
        promisor.toBuffer(),
        new anchor_1.BN(id).toArrayLike(Buffer, "le", 4),
    ];
};
exports.createPromiseSeeds = createPromiseSeeds;
