"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNetworkSeeds = void 0;
const createNetworkSeeds = (authority) => {
    return [Buffer.from("promise_network"), authority.toBuffer()];
};
exports.createNetworkSeeds = createNetworkSeeds;
