"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDefaultPlayerCosmetics = exports.getDefaultCamera = void 0;
function getDefaultCamera() {
    return {
        width: 3840,
        height: 2160
    };
}
exports.getDefaultCamera = getDefaultCamera;
function getDefaultPlayerCosmetics() {
    return {
        skin: 0,
        accessory: 0,
        book: 0,
        bag: 0,
        crate: 1,
        dead: 0
    };
}
exports.getDefaultPlayerCosmetics = getDefaultPlayerCosmetics;
