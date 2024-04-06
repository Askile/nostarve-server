"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Content = void 0;
class Content {
    server;
    items;
    entities;
    scripts;
    textures;
    constructor(server) {
        this.server = server;
        this.items = [];
        this.entities = [];
        this.scripts = [];
        this.textures = [];
    }
}
exports.Content = Content;
