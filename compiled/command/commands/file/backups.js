"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = exports.permission = exports.identifiers = void 0;
const permissions_1 = require("../../../enums/permissions");
const fs_1 = __importDefault(require("fs"));
const file_utils_1 = __importDefault(require("../../../modules/file.utils"));
exports.identifiers = ["backups"];
exports.permission = permissions_1.Permissions.OWNER;
function run(player, args, isServer) {
    let text = "";
    const backups = fs_1.default.readdirSync("./data/backups");
    for (let i = 0; i < backups.length; i++) {
        const backup = backups[i];
        text += i + " - " + backup + " " + file_utils_1.default.getFolderSize("./data/backups/" + backup) + "<br>";
    }
    return [true, text];
}
exports.run = run;
