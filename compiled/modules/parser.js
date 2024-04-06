"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Parser {
    static tryParseJSON(str) {
        try {
            return JSON.parse(str);
        }
        catch (e) {
            return null;
        }
    }
}
exports.default = Parser;
