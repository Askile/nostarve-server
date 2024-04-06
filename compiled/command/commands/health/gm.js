"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = exports.permission = exports.identifiers = void 0;
const permissions_1 = require("../../../enums/permissions");
const state_type_1 = require("../../../enums/types/state.type");
exports.identifiers = ["gm", "godmode"];
exports.permission = permissions_1.Permissions.OWNER;
function run(player, args, isServer) {
    player.toggleState(state_type_1.StateType.GOD_MODE);
    return [true, `God mode ${player.hasState(state_type_1.StateType.GOD_MODE) ? "enabled" : "disabled"}`];
}
exports.run = run;
