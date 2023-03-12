"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fromPromiseFilter = exports.PromiseField = void 0;
var PromiseField;
(function (PromiseField) {
    PromiseField[PromiseField["id"] = 9] = "id";
    PromiseField[PromiseField["network"] = 13] = "network";
    PromiseField[PromiseField["promisor"] = 45] = "promisor";
    PromiseField[PromiseField["state"] = 77] = "state";
})(PromiseField = exports.PromiseField || (exports.PromiseField = {}));
const fromPromiseFilter = (filter) => {
    if (filter == null || filter == undefined) {
        return undefined;
    }
    return [
        {
            memcmp: {
                offset: filter.field.valueOf(),
                bytes: filter.value,
            },
        },
    ];
};
exports.fromPromiseFilter = fromPromiseFilter;
