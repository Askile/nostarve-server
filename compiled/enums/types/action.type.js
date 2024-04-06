"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActionType = void 0;
var ActionType;
(function (ActionType) {
    ActionType[ActionType["DELETE"] = 1] = "DELETE";
    ActionType[ActionType["HURT"] = 2] = "HURT";
    ActionType[ActionType["COLD"] = 4] = "COLD";
    ActionType[ActionType["HUNGER"] = 8] = "HUNGER";
    ActionType[ActionType["ATTACK"] = 16] = "ATTACK";
    ActionType[ActionType["HEAL"] = 32] = "HEAL";
    ActionType[ActionType["WEB"] = 64] = "WEB";
})(ActionType || (exports.ActionType = ActionType = {}));
