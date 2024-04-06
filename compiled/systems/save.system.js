"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaveSystem = void 0;
const fs = __importStar(require("fs"));
const b_1 = __importDefault(require("../building/b"));
const crate_1 = require("../entities/crate");
const entity_type_1 = require("../enums/types/entity.type");
const player_1 = __importDefault(require("../entities/player"));
const master_1 = __importDefault(require("../master/master"));
const msgpack_lite_1 = __importDefault(require("msgpack-lite"));
const timestamp_1 = __importDefault(require("../modules/timestamp"));
const permissions_1 = require("../enums/permissions");
class SaveSystem {
    server;
    constructor(server) {
        this.server = server;
    }
    findLastSaved(id) {
        const files = fs.readdirSync("./data/backups");
        if (!files.length)
            return null;
        const lastFile = files[id ? id : files.length - 1];
        if (!lastFile)
            return null;
        const players = msgpack_lite_1.default.decode(fs.readFileSync("./data/backups/" + lastFile + "/players.txt"));
        const buildings = msgpack_lite_1.default.decode(fs.readFileSync("./data/backups/" + lastFile + "/buildings.txt"));
        const crates = msgpack_lite_1.default.decode(fs.readFileSync("./data/backups/" + lastFile + "/crates.txt"));
        return [players, buildings, crates];
    }
    async load(id) {
        const data = this.findLastSaved(id);
        if (!data) {
            this.server.loaded = true;
            return;
        }
        const now = Date.now();
        const [players, buildings, crates] = data;
        for (const p of players) {
            const [id, state, items, inventorySize, x, y, angle, info, action, speed, extra, health, bandage, reason, score, time, nickname, token, token_id, level, helmetId, rightId, vehicleId, createdAt, lastEvent, name, password, skin, accessory, book, bag, crate, dead] = p;
            const player = this.server.players[id - 1];
            player.inventory.maxSize = inventorySize;
            for (const [id, count] of items) {
                player.inventory.increase(id, count);
            }
            player.alive = true;
            player.id = id;
            player.state = state;
            player.reason = reason;
            player.position.set(x, y);
            player.realPosition.set(player.position);
            player.angle = angle;
            player.info = info;
            player.action = action;
            player.speed = speed;
            player.extra = extra;
            player.health = health;
            player.gauges.bandage = bandage;
            player.score = score;
            player.time = time;
            player.nickname = nickname;
            player.token = token;
            player.token_id = token_id;
            player.level = level;
            player.helmet = this.server.interactionSystem.items[helmetId];
            player.right = this.server.interactionSystem.items[rightId];
            player.vehicle = this.server.interactionSystem.items[vehicleId];
            player.createdAt = createdAt + now;
            player.lastEvent = lastEvent.map((time) => time === -1 ? -1 : time + now);
            player.cosmetics.skin = skin ?? 0;
            player.cosmetics.accessory = accessory ?? 0;
            player.cosmetics.book = book ?? 0;
            player.cosmetics.bag = bag ?? 0;
            player.cosmetics.crate = crate ?? 1;
            player.cosmetics.dead = dead ?? 0;
            player.account = await master_1.default.getAccount(this.server, name, password);
            player.permission = this.server.settings.admins.includes(player.account?.name) ? permissions_1.Permissions.OWNER : permissions_1.Permissions.PLAYER;
            this.server.playerPool.used[id] = true;
            this.server.alivePlayers.push(player);
            this.server.entities[id] = player;
        }
        for (const b of buildings) {
            const [type, id, pid, x, y, angle, info, action, speed, extra, health, createdAt, data, timestamps] = b;
            const player = this.server.players[pid - 1];
            if (!player?.alive) {
                continue;
            }
            const building = new b_1.default(type, player, this.server);
            this.server.entities[id] = building;
            this.server.entityPool.used[id] = true;
            building.id = id;
            building.pid = pid;
            building.position.set(x, y);
            building.realPosition.set(building.position);
            building.angle = angle;
            building.info = info;
            building.action = action;
            building.data = data;
            building.speed = speed;
            building.extra = extra;
            building.health = health;
            building.createdAt = createdAt;
            for (const timestamp of timestamps) {
                building.timestamps.set(timestamp[0], new timestamp_1.default(timestamp[1]));
            }
            if (building.type === entity_type_1.EntityType.TOTEM && building.data.length) {
                for (const data of building.data) {
                    const player = this.server.players[data - 1];
                    if (player?.alive) {
                        player.totem = building;
                    }
                }
            }
            if (building.getComponent("DOOR" /* ComponentType.DOOR */) && building.info % 2 !== 0) {
                building.setComponent("OBSTACLE" /* ComponentType.OBSTACLE */, false);
            }
            if (player) {
                building.owner = player;
                player.addBuilding(building);
            }
        }
        for (const c of crates) {
            const [id, x, y, angle, info, action, speed, extra, items, health, radius, createdAt, boxType] = c;
            const crate = new crate_1.Crate(this.server, {
                type: boxType,
                restore: true
            });
            for (const [id, count] of items) {
                if (crate.boxType === "gift")
                    continue;
                crate.inventory.increase(id, count);
            }
            crate.id = id;
            this.server.entityPool.used[id] = true;
            this.server.entities[crate.id] = crate;
            crate.position.set(x, y);
            crate.realPosition.set(crate.position);
            crate.angle = angle;
            crate.info = info;
            crate.action = action;
            crate.speed = speed;
            crate.extra = extra;
            crate.health = health;
            crate.createdAt = createdAt;
            crate.radius = radius;
        }
        setTimeout(() => {
            console.log(`[SaveSystem] Loaded ${players.length} players & ${buildings.length} buildings & ${crates.length} crates`);
            this.server.loaded = true;
            this.server.logger.log(`[SaveSystem] Loaded ${players.length} players & ${buildings.length} buildings & ${crates.length} crates`);
        }, 5000);
    }
    save() {
        const buildingsData = [];
        const playersData = [];
        const cratesData = [];
        const now = new Date().toISOString().replace(/:/g, '-');
        this.server.logger.log(`[SaveSystem] Saving ${this.server.entities.length} entities`);
        for (const entity of Object.values(this.server.entities)) {
            if (entity instanceof player_1.default && entity.alive) {
                playersData.push(entity.serialize());
            }
            else if (entity instanceof b_1.default) {
                buildingsData.push(entity.serialize());
            }
            else if (entity instanceof crate_1.Crate) {
                cratesData.push(entity.serialize());
            }
        }
        fs.mkdirSync("./data/backups/" + now, { recursive: true });
        fs.writeFileSync("./data/backups/" + now + "/buildings.txt", msgpack_lite_1.default.encode(buildingsData));
        fs.writeFileSync("./data/backups/" + now + "/players.txt", msgpack_lite_1.default.encode(playersData));
        fs.writeFileSync("./data/backups/" + now + "/crates.txt", msgpack_lite_1.default.encode(cratesData));
    }
}
exports.SaveSystem = SaveSystem;
