"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
class FileUtils {
    static getFolderSize(folderPath, folderSize = 0) {
        const files = fs_1.default.readdirSync(folderPath);
        for (const file of files) {
            const filePath = `${folderPath}/${file}`;
            const stats = fs_1.default.statSync(filePath);
            if (stats.isFile()) {
                folderSize += stats.size;
            }
            else if (stats.isDirectory()) {
                folderSize += FileUtils.getFolderSize(filePath, folderSize);
            }
        }
        return folderSize;
    }
}
exports.default = FileUtils;
