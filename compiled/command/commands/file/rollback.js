"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = exports.permission = exports.identifiers = void 0;
const permissions_1 = require("../../../enums/permissions");
exports.identifiers = ["rollback"];
exports.permission = permissions_1.Permissions.OWNER;
function run(player, args, isServer) {
    const idx = Number(args[0]);
    if (isNaN(idx)) {
        return [false, "Invalid index"];
    }
    else {
        this.server.saveSystem.load(idx);
        this.server.logger.log(`[Rollback] Rolling back to ${args[0]}`);
        return [true, "Rollbacked to " + args[0]];
    }
}
exports.run = run;
