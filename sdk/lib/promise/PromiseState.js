"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fromPromiseState = exports.toPromiseState = exports.PromiseState = void 0;
var PromiseState;
(function (PromiseState) {
    PromiseState[PromiseState["created"] = 0] = "created";
    PromiseState[PromiseState["active"] = 1] = "active";
    PromiseState[PromiseState["completed"] = 2] = "completed";
    PromiseState[PromiseState["voided"] = 3] = "voided";
})(PromiseState = exports.PromiseState || (exports.PromiseState = {}));
const toPromiseState = (state) => {
    if (state["created"] != null) {
        return PromiseState.created;
    }
    else if (state["active"] != null) {
        return PromiseState.active;
    }
    else if (state["completed"] != null) {
        return PromiseState.completed;
    }
    else {
        return PromiseState.voided;
    }
};
exports.toPromiseState = toPromiseState;
const fromPromiseState = (state) => {
    switch (state) {
        case PromiseState.created:
            return { created: {} };
        case PromiseState.active:
            return { active: {} };
        case PromiseState.completed:
            return { completed: {} };
        case PromiseState.voided:
            return { voided: {} };
    }
};
exports.fromPromiseState = fromPromiseState;
