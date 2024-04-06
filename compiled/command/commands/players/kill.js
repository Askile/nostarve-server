"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = exports.permission = exports.identifiers = void 0;
const permissions_1 = require("../../../enums/permissions");
const health_system_1 = __importDefault(require("../../../attributes/health.system"));
const action_type_1 = require("../../../enums/types/action.type");
const state_type_1 = require("../../../enums/types/state.type");
exports.identifiers = ["kill"];
exports.permission = permissions_1.Permissions.OWNER;
function run(player, args, isServer) {
    const id = Number(args[0]);
    const target = this.server.players[id - 1];
    if (!target) {
        return [false, "kill <id>"];
    }
    target.removeState(state_type_1.StateType.GOD_MODE);
    target.inventory.clear(true);
    health_system_1.default.damage(target, 200, action_type_1.ActionType.HURT);
    return [true, `${target.nickname} killed ${target.nickname}`];
}
exports.run = run;
