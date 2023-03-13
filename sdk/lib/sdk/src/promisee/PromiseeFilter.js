"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fromPromiseeFilter = exports.PromiseeField = void 0;
var PromiseeField;
(function (PromiseeField) {
    PromiseeField[PromiseeField["owner"] = 9] = "owner";
    PromiseeField[PromiseeField["creator"] = 41] = "creator";
    PromiseeField[PromiseeField["promise"] = 73] = "promise";
})(PromiseeField = exports.PromiseeField || (exports.PromiseeField = {}));
const fromPromiseeFilter = (filter) => {
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
exports.fromPromiseeFilter = fromPromiseeFilter;
