"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ticker = void 0;
const nanotimer_1 = __importDefault(require("nanotimer"));
const captcha_1 = require("../packets/captcha");
const entity_type_1 = require("../enums/types/entity.type");
const master_1 = __importDefault(require("../master/master"));
const movement_1 = __importDefault(require("../movement/movement"));
const physics_1 = __importDefault(require("../physics/physics"));
const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;
class Ticker {
    delta;
    tps;
    server;
    timestamps;
    constructor(server) {
        const now = Date.now();
        this.server = server;
        this.timestamps = new Map();
        this.timestamps.set("oldTime", now);
        this.timestamps.set("playerCount", now);
        this.timestamps.set("captchaUpdate", now);
        this.timestamps.set("packetReset", now);
        this.timestamps.set("saveData", now);
        this.timestamps.set("resourceUpdate", now);
        this.delta = 1 / this.server.settings.tps;
        const fastTimer = new nanotimer_1.default(); // used for entity creation
        fastTimer.setInterval(() => {
            const now = Date.now();
            const resetPackets = now - this.timestamps.get("packetReset") >= 300;
            this.server.timeSystem.tick();
            this.server.eventSystem.tick();
            if (now - this.timestamps.get("captchaUpdate") >= 12000) {
                this.timestamps.set("captchaUpdate", now);
                (0, captcha_1.updateCaptcha)();
            }
            for (const row of this.server.world.grid) {
                for (const chunk of row) {
                    chunk.entities = [];
                }
            }
            const entities = Object.values(this.server.entities);
            for (const entity of entities) {
                if (!entity)
                    continue;
                const chunkX = Math.floor(entity.position.x / 100);
                const chunkY = Math.floor(entity.position.y / 100);
                if (this.server.world.grid[chunkY] && this.server.world.grid[chunkY][chunkX]) {
                    this.server.world.grid[chunkY][chunkX].entities.push(entity);
                }
            }
            for (const entity of entities) {
                if (!entity)
                    continue;
                entity.onTick();
                if (entity.type === entity_type_1.EntityType.PLAYER) {
                    if (resetPackets) {
                        if (entity.client?.isActive) {
                            entity.client.ip.packetsQty = [];
                        }
                        this.timestamps.set("packetReset", now);
                    }
                    if (entity.client && entity.client.closing && entity.client.isActive) {
                        entity.client.socket.close();
                    }
                    movement_1.default.tick(entity);
                    entity.position.set(entity.position.clamp(1, 1, this.server.world.width - 1, this.server.world.height - 1));
                    entity.realPosition.set(entity.realPosition.clamp(1, 1, this.server.world.width - 1, this.server.world.height - 1));
                    physics_1.default.updateState(entity);
                    this.server.combatSystem.tick(entity);
                }
            }
            this.server.craftSystem.tick();
            this.server.buildingSystem.tick();
            this.server.shareUnits();
            this.delta = (now - this.timestamps.get("oldTime")) / 1000;
            this.tps = 1 / this.delta;
            if (this.tps < this.server.settings.tps / 3) {
                this.server.logger.warn(`[TICKER] TPS: ${this.tps} | DELTA: ${this.delta}`);
            }
            this.timestamps.set("oldTime", now);
        }, [], 1 / this.server.settings.tps + "s");
        const slowTimer = new nanotimer_1.default();
        slowTimer.setInterval(() => {
            const now = Date.now();
            this.server.animalSpawner.tick();
            if (now - this.timestamps.get("playerCount") >= 60000) {
                this.timestamps.set("playerCount", now);
                master_1.default.sendPlayerCount(this.server);
            }
            if (now - this.timestamps.get("saveData") >= this.server.settings.save_interval * MINUTE) {
                this.timestamps.set("saveData", now);
                this.server.saveSystem.save();
            }
            if (now - this.timestamps.get("resourceUpdate") > this.server.config.resource_delay - ((this.server.config.resource_delay - this.server.config.resource_delay_min) *
                (this.server.alivePlayers.length / this.server.settings.player_limit))) {
                this.timestamps.set("resourceUpdate", now);
                for (const tile of this.server.world.tiles) {
                    tile.count = Math.clamp(tile.count + Math.ceil(tile.limit / 15), 0, tile.limit);
                    if (tile.entity) {
                        tile.entity.info = tile.count;
                    }
                }
            }
            this.server.leaderboard.tick();
        }, [], "1s");
    }
}
exports.Ticker = Ticker;
