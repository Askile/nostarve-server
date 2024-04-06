import * as fs from "fs";
import {Server} from "../server";
import Building from "../building/building";
import {Crate} from "../entities/crate";
import {EntityType} from "../enums/types/entity.type";
import Player from "../entities/player";
import Master from "../master/master";
import msgpack from "msgpack-lite";
import {Vector} from "../modules/vector";
import Timestamp from "../modules/timestamp";
import {ComponentType} from "../enums/types/component.type";
import {Permissions} from "../enums/permissions";

export class SaveSystem {
    public server: Server;
    constructor(server: Server) {
        this.server = server;
    }

    private findLastSaved(id?: number) {
        const files = fs.readdirSync("./data/backups");

        if(!files.length) return null;

        const lastFile = files[id ? id : files.length - 1];

        if(!lastFile) return null;

        const players = msgpack.decode(fs.readFileSync("./data/backups/" + lastFile + "/players.txt"));
        const buildings = msgpack.decode(fs.readFileSync("./data/backups/" + lastFile + "/buildings.txt"));
        const crates = msgpack.decode(fs.readFileSync("./data/backups/" + lastFile + "/crates.txt"));

        return [players, buildings, crates];
    }

    public async load(id?: number) {
        const data = this.findLastSaved(id);
        if(!data) {
            this.server.loaded = true;
            return;
        }
        const now = Date.now();
        const [players, buildings, crates] = data;
        for (const p of players) {
            const [
                id, state, items, inventorySize, x, y, angle, info, action, speed,
                extra, health, bandage,
                reason, score, time, nickname, token, token_id, level,
                helmetId, rightId, vehicleId,
                createdAt, lastEvent, name, password, skin, accessory, book, bag, crate, dead
            ] = p;

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
            player.lastEvent = lastEvent.map((time: number) => time === -1 ? -1 : time + now);
            player.cosmetics.skin = skin ?? 0;
            player.cosmetics.accessory = accessory ?? 0;
            player.cosmetics.book = book ?? 0;
            player.cosmetics.bag = bag ?? 0;
            player.cosmetics.crate = crate ?? 1;
            player.cosmetics.dead = dead ?? 0;
            player.account = await Master.getAccount(this.server, name, password);
            player.permission = this.server.settings.admins.includes(player.account?.name) ? Permissions.OWNER : Permissions.PLAYER;

            this.server.playerPool.used[id] = true;
            this.server.alivePlayers.push(player);
            this.server.entities[id] = player;
        }

        for (const b of buildings) {
            const [
                type, id, pid, x, y, angle, info, action, speed,
                extra, health, createdAt,
                data, timestamps
            ] = b;
            const player = this.server.players[pid - 1];
            if(!player?.alive) {
                continue;
            }

            const building = new Building(type, player, this.server);

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
                building.timestamps.set(timestamp[0], new Timestamp(timestamp[1]));
            }

            if(building.type === EntityType.TOTEM && building.data.length) {
                for (const data of building.data) {
                    const player = this.server.players[data - 1];
                    if(player?.alive) {
                        player.totem = building;
                    }
                }
            }

            if (building.getComponent(ComponentType.DOOR) && building.info % 2 !== 0) {
                building.setComponent(ComponentType.OBSTACLE, false);
            }

            if(player) {
                building.owner = player;
                player.addBuilding(building);
            }
        }

        for (const c of crates) {
            const [
                id, x, y, angle, info, action, speed,
                extra, items, health, radius,
                createdAt, boxType
            ] = c;

            const crate = new Crate(this.server, {
                type: boxType,
                restore: true
            });

            for (const [id, count] of items) {
                if(crate.boxType === "gift") continue;
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

    public save() {
        const buildingsData = [];
        const playersData = [];
        const cratesData = [];

        const now = new Date().toISOString().replace(/:/g, '-');

        this.server.logger.log(`[SaveSystem] Saving ${this.server.entities.length} entities`);
        for (const entity of Object.values(this.server.entities)) {
            if(entity instanceof Player && entity.alive) {
                playersData.push((entity.serialize as any)());
            } else if(entity instanceof Building) {
                buildingsData.push((entity.serialize as any)());
            } else if(entity instanceof Crate) {
                cratesData.push((entity.serialize as any)());
            }
        }

        fs.mkdirSync("./data/backups/" + now, {recursive: true});
        fs.writeFileSync("./data/backups/" + now + "/buildings.txt", msgpack.encode(buildingsData));
        fs.writeFileSync("./data/backups/" + now + "/players.txt", msgpack.encode(playersData));
        fs.writeFileSync("./data/backups/" + now + "/crates.txt", msgpack.encode(cratesData));
    }
}