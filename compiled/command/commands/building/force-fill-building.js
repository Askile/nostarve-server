"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = exports.permission = exports.identifiers = void 0;
const permissions_1 = require("../../../enums/permissions");
const building_1 = __importDefault(require("../../../building/building"));
const entity_type_1 = require("../../../enums/types/entity.type");
exports.identifiers = ["ffb", "force-fill-building"];
exports.permission = permissions_1.Permissions.OWNER;
function run(player, args, isServer) {
    const type = Number(args[0]) || entity_type_1.EntityType[args[0].toUpperCase()] || undefined;
    const sx = Number(args[1]) || undefined;
    const sy = Number(args[2]) || undefined;
    const ex = Number(args[3]) || undefined;
    const ey = Number(args[4]) || undefined;
    if (type === undefined || sx === undefined || sy === undefined || ex === undefined || ey === undefined) {
        return [false, "ffb <type> <sx> <sy> <ex> <ey>"];
    }
    for (let x = sx; x < ex + 1; x++) {
        for (let y = sy; y < ey + 1; y++) {
            const building = new building_1.default(type, player, this.server);
            building.position.set(x * 100 + 50, y * 100 + 50);
            building.onPlaced();
        }
    }
    return [true, `Spawned ${entity_type_1.EntityType[type]} from ${sx}:${sy} to ${ex}:${ey}`];
}
exports.run = run;
