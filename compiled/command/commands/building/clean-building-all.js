"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = exports.permission = exports.identifiers = void 0;
const permissions_1 = require("../../../enums/permissions");
const building_1 = __importDefault(require("../../../building/building"));
exports.identifiers = ["cba", "clean-building-all"];
exports.permission = permissions_1.Permissions.OWNER;
function run(player, args, isServer) {
    let count = 0;
    let sx = Number(args[0]);
    let sy = Number(args[1]);
    let ex = Number(args[2]);
    let ey = Number(args[3]);
    if (isNaN(sx) || isNaN(sy) || isNaN(ex) || isNaN(ey)) {
        for (const entity of Object.values(this.server.entities)) {
            if (entity instanceof building_1.default && entity.owner) {
                count++;
                entity.delete();
                entity.onDead();
            }
        }
    }
    else {
        sx = Math.floor(sx) * 100 + 50;
        sy = Math.floor(sy) * 100 + 50;
        ex = Math.floor(ex) * 100 + 50;
        ey = Math.floor(ey) * 100 + 50;
        for (const entity of Object.values(this.server.entities)) {
            if (entity instanceof building_1.default && entity.owner && entity.position.x >= sx && entity.position.y >= sy && entity.position.x <= ex && entity.position.y <= ey) {
                count++;
                entity.delete();
                entity.onDead();
            }
        }
    }
    return [true, `Cleaned ${count} buildings`];
}
exports.run = run;
