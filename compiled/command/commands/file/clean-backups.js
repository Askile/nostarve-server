"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = exports.permission = exports.identifiers = void 0;
const permissions_1 = require("../../../enums/permissions");
const fs_1 = __importDefault(require("fs"));
exports.identifiers = ["clean-backups"];
exports.permission = permissions_1.Permissions.OWNER;
function run(player, args, isServer) {
    const backups = fs_1.default.readdirSync("./data/backups");
    for (const backup of backups) {
        const src = "./data/backups/" + backup;
        fs_1.default.rmSync(src + "/crates.txt");
        fs_1.default.rmSync(src + "/players.txt");
        fs_1.default.rmSync(src + "/buildings.txt");
        fs_1.default.rmdirSync(src);
    }
    return [true, "Backups cleaned"];
}
exports.run = run;
