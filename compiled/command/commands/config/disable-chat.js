"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = exports.permission = exports.identifiers = void 0;
const permissions_1 = require("../../../enums/permissions");
exports.identifiers = ["dch", "disable-chat"];
exports.permission = permissions_1.Permissions.OWNER;
function run(player, args, isServer) {
    this.server.config.disable_chat = this.server.config.disable_chat === 1 ? 0 : 1;
    return [true, "Chat is now " + (this.server.config.disable_chat === 1 ? "disabled" : "enabled")];
}
exports.run = run;
