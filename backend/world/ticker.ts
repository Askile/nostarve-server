import {Server} from "../server";
import NanoTimer from "nanotimer";
import Player from "../entities/player";
import {Crate} from "../entities/crate";
import {updateCaptcha} from "../packets/captcha";
import {ClientStringPackets} from "../enums/packets";
import {EntityType} from "../enums/types/entity.type";
import {Entity} from "../entities/entity";
import Master from "../master/master";
import Movement from "../movement/movement";
import Physics from "../physics/physics";
import {ActionType} from "../enums/types/action.type";
import HealthSystem from "../attributes/health.system";

const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;

export class Ticker {
    public delta: number;
    public tps: number;
    private server: Server;
    private timestamps: Map<string, number>;
    constructor(server: Server) {
        const now = Date.now();

        this.server = server;
        this.timestamps = new Map<string, number>();

        this.timestamps.set("oldTime", now);
        this.timestamps.set("playerCount", now);
        this.timestamps.set("captchaUpdate", now);
        this.timestamps.set("packetReset", now);
        this.timestamps.set("saveData", now);
        this.timestamps.set("resourceUpdate", now);

        this.delta = 1 / this.server.settings.tps;

        const fastTimer = new NanoTimer(); // used for entity creation

        fastTimer.setInterval(() => {
            const now = Date.now();
            const resetPackets = now - this.timestamps.get("packetReset") >= 300;

            this.server.timeSystem.tick();
            this.server.eventSystem.tick();

            if(now - this.timestamps.get("captchaUpdate") >= 12000) {
                this.timestamps.set("captchaUpdate", now);
                updateCaptcha();
            }

            for (const row of this.server.world.grid) {
                for (const chunk of row) {
                    chunk.entities = [];
                }
            }

            const entities = Object.values(this.server.entities) as (Entity & Player)[];

            for (const entity of entities) {
                if(!entity) continue;

                const chunkX = Math.floor(entity.position.x / 100);
                const chunkY = Math.floor(entity.position.y / 100);

                if(this.server.world.grid[chunkY] && this.server.world.grid[chunkY][chunkX]) {
                    this.server.world.grid[chunkY][chunkX].entities.push(entity);
                }
            }

            for (const entity of entities) {
                if(!entity) continue;

                entity.onTick();

                if(entity.type === EntityType.PLAYER) {
                    if(resetPackets) {
                        if(entity.client?.isActive) {
                            entity.client.ip.packetsQty = [];
                        }
                        this.timestamps.set("packetReset", now);
                    }

                    if(entity.client && entity.client.closing && entity.client.isActive) {
                        entity.client.socket.close();
                    }

                    Movement.tick(entity);

                    entity.position.set(entity.position.clamp(1, 1, this.server.world.width - 1, this.server.world.height - 1));
                    entity.realPosition.set(entity.realPosition.clamp(1, 1, this.server.world.width - 1, this.server.world.height - 1));

                    Physics.updateState(entity);

                    this.server.combatSystem.tick(entity);
                }
            }

            this.server.craftSystem.tick();
            this.server.buildingSystem.tick();

            this.server.shareUnits();

            this.delta = (now - this.timestamps.get("oldTime")) / 1000;
            this.tps = 1 / this.delta;

            if(this.tps < this.server.settings.tps / 3) {
                this.server.logger.warn(`[TICKER] TPS: ${this.tps} | DELTA: ${this.delta}`);
            }

            this.timestamps.set("oldTime", now);
        }, [], 1 / this.server.settings.tps + "s");

        const slowTimer = new NanoTimer();

        slowTimer.setInterval(() => {
            const now = Date.now();

            this.server.animalSpawner.tick();

            if(now - this.timestamps.get("playerCount") >= 60000) {
                this.timestamps.set("playerCount", now);
                Master.sendPlayerCount(this.server);
            }

            if(now - this.timestamps.get("saveData") >= this.server.settings.save_interval * MINUTE) {
                this.timestamps.set("saveData", now);
                this.server.saveSystem.save();
            }

            if(
                now - this.timestamps.get("resourceUpdate") > this.server.config.resource_delay - (
                (this.server.config.resource_delay - this.server.config.resource_delay_min) *
                (this.server.alivePlayers.length / this.server.settings.player_limit))
            ) {
                this.timestamps.set("resourceUpdate", now);

                for (const tile of this.server.world.tiles) {
                    tile.count = Math.clamp(tile.count + Math.ceil(tile.limit / 15), 0, tile.limit);

                    if(tile.entity) {
                        tile.entity.info = tile.count;
                    }
                }
            }

            this.server.leaderboard.tick();
        }, [], "1s");
    }
}
