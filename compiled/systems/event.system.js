"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventSystem = void 0;
const player_1 = __importDefault(require("../entities/player"));
const item_type_1 = require("../enums/types/item.type");
const id_pool_1 = require("../modules/id.pool");
class EventSystem {
    eventPool;
    server;
    lastEvent = [];
    locationInventoryEvents = [];
    inventoryEvents = [];
    locationEvents = [];
    killEvents = [];
    timeEvents = [];
    scoreEvents = [];
    constructor(server) {
        this.server = server;
        this.eventPool = new id_pool_1.IdPool(0);
        this.initEvents();
    }
    initEvents() {
        if (!this.server.config.important.events)
            return;
        for (let event of this.server.config.important.events) {
            event.id = this.eventPool.generate();
            if (event.item) {
                event.item = item_type_1.ItemType[event.item.toUpperCase()];
            }
            if (event.repeat) {
                event.repeat *= 1000;
            }
            switch (event.type) {
                case "inventory":
                    this.inventoryEvents.push(event);
                    break;
                case "location":
                    this.locationEvents.push(event);
                    break;
                case "score":
                    this.scoreEvents.push(event);
                    break;
                case "kill":
                    this.killEvents.push(event);
                    break;
                case "locationInventory":
                    this.locationInventoryEvents.push(event);
                    break;
                case "time":
                    this.timeEvents.push(event);
                    break;
                default:
                    break;
            }
        }
    }
    tick() {
        const now = Date.now();
        for (const player of this.server.alivePlayers) {
            for (const event of this.scoreEvents) {
                if (!event.commands.length)
                    continue;
                if (player.lastEvent[event.id] !== -1 && player.score >= event.score) {
                    this.commandsArray(player, event);
                    player.lastEvent[event.id] = -1;
                }
            }
            for (const event of this.killEvents) {
                if (!event.commands.length)
                    continue;
                if (player.lastEvent[event.id] !== -1 && player.kills >= event.kill) {
                    this.commandsArray(player, event);
                    player.lastEvent[event.id] = -1;
                }
            }
            for (const event of this.inventoryEvents) {
                if (!event.commands.length)
                    continue;
                if (!player.inventory.contains(event.item, event.amount))
                    continue;
                if (now - player.lastEvent[event.id] >= event.repeat) {
                    this.commandsArray(player, event);
                    player.lastEvent[event.id] = now;
                }
            }
        }
        for (const event of this.locationInventoryEvents) {
            if (!event.commands.length)
                continue;
            const isCube = typeof event.sx === "number" && typeof event.sy === "number" &&
                typeof event.ex === "number" && typeof event.ey === "number";
            if (isCube) {
                for (const player of this.server.alivePlayers) {
                    const pos = player.realPosition.divide(100).floor();
                    player.lastEvent[event.id] ??= now;
                    if (player.lastEvent[event.id] === -1)
                        continue;
                    if (player.inventory.contains(event.item, event.amount) &&
                        now - player.lastEvent[event.id] >= event.repeat &&
                        event.sx <= pos.x &&
                        pos.x <= event.ex &&
                        event.sy <= pos.y &&
                        pos.y <= event.ey) {
                        this.commandsArray(player, event);
                        player.lastEvent[event.id] = event.repeat === 0 ? -1 : now;
                    }
                }
            }
            else {
                const thisChunk = this.server.world.grid[event.y][event.x];
                if (!thisChunk)
                    continue;
                for (const player of thisChunk.entities) {
                    if (!(player instanceof player_1.default))
                        continue;
                    if (player.lastEvent[event.id] === -1)
                        continue;
                    player.lastEvent[event.id] ??= now;
                    if (player.inventory.contains(event.item, event.amount) && now - player.lastEvent[event.id] >= event.repeat) {
                        this.commandsArray(player, event);
                        player.lastEvent[event.id] = event.repeat === 0 ? -1 : now;
                    }
                }
            }
        }
        for (const event of this.timeEvents) {
            if (!event.commands.length)
                continue;
            if (event.repeat === 0) {
                for (const command of event.commands) {
                    this.server.commandSystem.handleServerCommand(command);
                }
                this.timeEvents = this.timeEvents.filter(e => e !== event);
            }
            else {
                this.lastEvent[event.id] ??= now;
                if (now - this.lastEvent[event.id] >= event.repeat) {
                    this.lastEvent[event.id] = now;
                    for (const command of event.commands) {
                        this.server.commandSystem.handleServerCommand(command);
                    }
                }
            }
        }
        for (const event of this.locationEvents) {
            if (!event.commands.length)
                continue;
            const isCube = typeof event.sx === "number" && typeof event.sy === "number" &&
                typeof event.ex === "number" && typeof event.ey === "number";
            if (isCube) {
                for (const player of this.server.alivePlayers) {
                    const pos = player.realPosition.divide(100).floor();
                    if (player.lastEvent[event.id] === -1)
                        continue;
                    player.lastEvent[event.id] ??= now;
                    if (now - player.lastEvent[event.id] >= event.repeat &&
                        event.sx <= pos.x &&
                        pos.x <= event.ex &&
                        event.sy <= pos.y &&
                        pos.y <= event.ey) {
                        this.commandsArray(player, event);
                        player.lastEvent[event.id] = event.repeat === 0 ? -1 : now;
                    }
                }
            }
            else {
                const thisChunk = this.server.world.grid[event.y][event.x];
                if (!thisChunk)
                    continue;
                for (const player of thisChunk.entities) {
                    if (!(player instanceof player_1.default))
                        continue;
                    if (player.lastEvent[event.id] === -1)
                        continue;
                    player.lastEvent[event.id] ??= now;
                    if (now - player.lastEvent[event.id] >= event.repeat) {
                        this.commandsArray(player, event);
                        player.lastEvent[event.id] = event.repeat === 0 ? -1 : now;
                    }
                }
            }
        }
    }
    commandsArray(player, event) {
        for (const command of event.commands) {
            this.server.commandSystem.handleServerCommand(command, player);
        }
    }
}
exports.EventSystem = EventSystem;
