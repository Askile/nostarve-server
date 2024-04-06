"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = exports.permission = exports.identifiers = void 0;
const permissions_1 = require("../../../enums/permissions");
const building_1 = __importDefault(require("../../../building/building"));
const entity_type_1 = require("../../../enums/types/entity.type");
exports.identifiers = ["fsb", "force-spawn-building"];
exports.permission = permissions_1.Permissions.OWNER;
function run(player, args, isServer) {
    const type = Number(args[0]) || entity_type_1.EntityType[args[0].toUpperCase()];
    const x = Number(args[1]);
    const y = Number(args[2]);
    if (isNaN(type) || isNaN(x) || isNaN(y)) {
        return [false, "fsb <type> <x> <y>"];
    }
    const building = new building_1.default(type, player, this.server);
    building.position.set(x * 100, y * 100);
    building.realPosition.set(x * 100, y * 100);
    building.onPlaced();
    return [true, `Spawned ${entity_type_1.EntityType[type]} to ${x}:${y}`];
}
exports.run = run;
