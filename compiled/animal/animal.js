"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const entity_1 = require("../entities/entity");
class Animal extends entity_1.Entity {
    constructor(type, server) {
        super(type, server);
    }
    onTick() {
    }
}
exports.default = Animal;
