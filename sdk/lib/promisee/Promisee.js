"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPromiseeSeeds = void 0;
const createPromiseeSeeds = (promise, owner) => {
    return [Buffer.from("promisee"), promise.toBuffer(), owner.toBuffer()];
};
exports.createPromiseeSeeds = createPromiseeSeeds;
