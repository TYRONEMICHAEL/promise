"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fromPromisorState = exports.toPromisorState = exports.PromisorState = void 0;
var PromisorState;
(function (PromisorState) {
    PromisorState[PromisorState["active"] = 0] = "active";
    PromisorState[PromisorState["inactive"] = 1] = "inactive";
})(PromisorState = exports.PromisorState || (exports.PromisorState = {}));
const toPromisorState = (state) => {
    if (state["active"] != null) {
        return PromisorState.active;
    }
    else {
        return PromisorState.inactive;
    }
};
exports.toPromisorState = toPromisorState;
const fromPromisorState = (state) => {
    switch (state) {
        case PromisorState.active:
            return { active: {} };
        case PromisorState.inactive:
            return { inActive: {} };
    }
};
exports.fromPromisorState = fromPromisorState;
