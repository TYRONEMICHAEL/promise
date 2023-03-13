"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fromPromisorFilter = exports.PromisorField = void 0;
/*
pub struct Promisor {
    // Bump seed
    pub bump: u8,
    // The owner of this account
    pub owner: Pubkey,
    // The promise network this account belongs to
    pub promise_network: Pubkey,
    // The state of this account
    pub state: PromisorState,
    // The last time this account was updated
    pub created_at: i64,
    // The last time this account was updated
    pub updated_at: i64,
    // The number of promises this promisor has made
    // Will be used for seed generation
    pub num_promises: i32,
}
*/
var PromisorField;
(function (PromisorField) {
    PromisorField[PromisorField["owner"] = 9] = "owner";
    PromisorField[PromisorField["network"] = 41] = "network";
    PromisorField[PromisorField["state"] = 73] = "state";
})(PromisorField = exports.PromisorField || (exports.PromisorField = {}));
const fromPromisorFilter = (filter) => {
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
exports.fromPromisorFilter = fromPromisorFilter;
