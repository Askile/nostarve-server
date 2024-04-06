import {Entity} from "../entities/entity";
import Player from "../entities/player";
import {Server} from "../server";
import {EntityType} from "../enums/types/entity.type";
import Timestamp from "../modules/timestamp";
import {ComponentType} from "../enums/types/component.type";
import {ItemType} from "../enums/types/item.type";
import {RECIPES} from "../default/default.recipes";
import {DeathReason} from "../enums/death.reason";
import HealthSystem from "../attributes/health.system";
import {ActionType} from "../enums/types/action.type";
import {BinaryWriter} from "../modules/binary.writer";
import {ClientPackets} from "../enums/packets";
import TeamSystem from "../team/team.system";
import BuildingUtils from "./building.utils";
import {StateType} from "../enums/types/state.type";


export default class Building extends Entity {
    public timestamps: Map<string, Timestamp>;
    public data: any[];
    public owner: Player;

    constructor(type: number, owner: Player, server: Server) {
        super(type, server);

        this.timestamps = new Map();
        this.data = [];
        this.owner = owner ?? undefined;
    }

    public onPlaced() {
        switch (this.type) {
            case EntityType.BERRY_SEED:
            case EntityType.WHEAT_SEED:
            case EntityType.PUMPKIN_SEED:
            case EntityType.CARROT_SEED:
            case EntityType.TOMATO_SEED:
            case EntityType.THORNBUSH_SEED:
            case EntityType.GARLIC_SEED:
            case EntityType.WATERMELON_SEED:
            case EntityType.ALOE_VERA_SEED: {
                this.info = 10;

                if(this.owner?.helmet?.id === ItemType.PEASANT) this.data = [1];
                if(this.owner?.helmet?.id === ItemType.WINTER_PEASANT) this.data = [2];
            } break;
            case EntityType.TOTEM: {
                this.timestamps.set("teammates", new Timestamp(3000));
                if(this.owner?.id) {
                    this.owner.totem = this;
                    this.data.push(this.owner.id);
                }
            } break;
        }

        if (this.hasComponent(ComponentType.HEALTH_BAR)) {
            this.info = 100;
            if (this.hasComponent(ComponentType.DOOR)) {
                this.info = 200;
            }
        }

        this.pid = this.owner?.id ?? 0;

        this.realPosition.set(this.position);
        this.id = this.server.entityPool.generate();
        this.server.entities[this.id] = this;

        const timeEvents = this.getComponent("time-events");
        if(timeEvents && timeEvents.length) {
            for (const {time, commands} of timeEvents) {
                this.timestamps.set("time-event#" + this.id, new Timestamp(time * 1000));
            }
        }
    }

    public onTick() {
        const now = Date.now();
        /* Special buildings */
        switch (this.type) {
            case EntityType.BERRY_SEED:
            case EntityType.WHEAT_SEED:
            case EntityType.PUMPKIN_SEED:
            case EntityType.CARROT_SEED:
            case EntityType.TOMATO_SEED:
            case EntityType.THORNBUSH_SEED:
            case EntityType.GARLIC_SEED:
            case EntityType.WATERMELON_SEED:
            case EntityType.ALOE_VERA_SEED: {
                const data = this.data[0];

                const isPeasant = data === 1;
                const isWinterPeasant = data === 2;

                const hasBorn = now - this.createdAt >= this.server.configSystem.seedBirth[this.type] * (this.hasState(StateType.IN_PLOT) ? isPeasant ? 0.6 : 0.8 : isPeasant ? 0.8 : 1) * (isWinterPeasant ? 0.6 : 1);
                const hasGrowth = now - this.timestamps[0] >= this.server.configSystem.seedGrowth[this.type] * (this.hasState(StateType.IN_PLOT) ? isPeasant ? 0.6 : 0.8 : isPeasant ? 0.8 : 1) * (isWinterPeasant ? 0.6 : 1);
                const hasDrain = now - this.timestamps[1] >= this.server.configSystem.seedDrain[this.type] * (this.hasState(StateType.IN_PLOT) ? isPeasant ? 1.4 : 1.2 : isPeasant ? 1.2 : 1) * (isWinterPeasant ? 1.4 : 1);
                const needDelete = now - this.createdAt >= this.server.configSystem.seedLife[this.type];

                if (hasDrain && this.info !== 10 && !(this.info & 16)) {
                    this.timestamps[1] = now;
                    this.info |= 16;
                }

                if (hasGrowth && this.info !== 10 && !(this.info & 16)) {
                    this.timestamps[0] = now;
                    this.info = Math.min(this.server.configSystem.seedFruitsCount[this.type], this.info + 1);
                }

                if (hasBorn && this.info === 10) {
                    this.info = 0;
                    this.timestamps[0] = now;
                    this.timestamps[1] = now;
                }

                needDelete && this.delete();
            } break;
            case EntityType.TOTEM: {
                if (this.timestamps.get("teammates").isFinished()) {
                    const positions = new BinaryWriter();
                    positions.writeUInt8(ClientPackets.MINIMAP);

                    for (const id of this.data) {
                        const player = this.server.players[id - 1];
                        if (player.alive) positions.writeUInt8(player.position.x / this.server.world.width * 250, player.position.y / this.server.world.height * 250);
                    }

                    for (const id of this.data) {
                        const player = this.server.players[id - 1];
                        if (player?.client) player.client.sendBinary(positions.toBuffer());
                    }
                }
            } break;
        }

        if(!BuildingUtils.isDoor(this.type) && BuildingUtils.isSpike(this.type) && Date.now() - this.createdAt > 120_000) {
            this.delete();
        }

        const timeEvents = this.getComponent("time-events");
        if(timeEvents?.length) {
            for (const {time, commands} of timeEvents) {
                const timestamp = this.timestamps.get("time-event#" + this.id);
                if(timestamp?.isFinished()) {
                    for (const command of commands) {
                        this.server.commandSystem.handleServerCommand(command, this.owner);
                    }
                }
            }
        }
    }

    public updateInfo() {
        if (this.hasComponent(ComponentType.HEALTH_BAR)) {
            this.info = Math.floor(this.health / this.server.configSystem.health[this.type] * 100);
            if (this.hasComponent(ComponentType.DOOR)) {
                this.info = Math.floor(this.health / this.server.configSystem.health[this.type] * 200);
                const isEven = this.info % 2 === 0;

                if (isEven && !this.getComponent(ComponentType.OBSTACLE)) {
                    this.info -= 1;
                } else if(!isEven && this.getComponent(ComponentType.OBSTACLE)) {
                    this.info += 1;
                }
            }
        }
    }

    public onDamage(damager?: Entity) {
        if (!damager) return;
        if (this.hasComponent(ComponentType.HEALTH_BAR)) {
            const nearest = this.server.world.getNearest(this, [EntityType.PLAYER], this.radius + 24);
            this.info = Math.floor(this.health / this.server.configSystem.health[this.type] * 100);
            if (this.hasComponent(ComponentType.DOOR)) {
                this.info = Math.floor(this.health / this.server.configSystem.health[this.type] * 200);
                const isEven = this.info % 2 === 0;

                if(damager instanceof Player && TeamSystem.isAlly(damager, this?.owner) && !(nearest && !this.getComponent(ComponentType.OBSTACLE))) {
                    this.setComponent(ComponentType.OBSTACLE, !this.getComponent(ComponentType.OBSTACLE));
                }

                if (isEven && !this.getComponent(ComponentType.OBSTACLE)) {
                    this.info -= 1;
                } else if(!isEven && this.getComponent(ComponentType.OBSTACLE)) {
                    this.info += 1;
                }
            }
        }

        if(damager instanceof Player) {
            if (this.isSeed()) {
                const isBorn = this.info !== 10;
                if (isBorn && this.info && damager.right.id !== ItemType.WATERING_CAN_FULL && this.info !== 16) {
                    const harvest = damager.right.id === ItemType.GOLD_PITCHFORK ? 3 : ItemType.PITCHFORK ? 2 : 1;
                    this.info -= 1;
                    this.owner.score += 3 * harvest;
                    damager.inventory.increase(this.server.configSystem.seedFruits[this.type], harvest, true);
                }
                if (damager.right.id === ItemType.WATERING_CAN_FULL && this.info >= 16) {
                    this.info -= 16;
                    this.timestamps[1] = Date.now();
                }
            }
        }
    }

    public delete() {
        super.delete();

        switch (this.type) {
            case EntityType.TOTEM: {
                this.server.teamSystem.destroyTeam(this);
            } break;
        }
    }

    public onDead(damager?: Entity & Player) {
        super.onDead(damager);

        if (damager?.type === EntityType.PLAYER && this.owner) {
            switch (this.type) {
                case EntityType.EMERALD_MACHINE: {
                    this.owner.reason = DeathReason.EMERALD;
                    HealthSystem.damage(this.owner, 200, ActionType.HURT, damager);
                } break;
            }
        }

        if (damager?.type === EntityType.PLAYER) {
            if (this.server.config.disable_gather_building === 0) {
                const id = ItemType[EntityType[this.type] as any] as any;
                const craft = RECIPES[id];

                if (craft?.r) {
                    for (const [id, count] of craft.r) {
                        if (count === 1) continue;

                        damager.inventory.increase(id, ~~(count / 1.8), true);
                    }
                }

            }

            damager.score += 20;
        }

        if (this.owner?.buildings[this.type]) {
            this.owner.buildings[this.type] = this.owner.buildings[this.type].filter(building => building !== this);
        }
    }

    public isVisualHealth() {
        return [
            EntityType.WOOD_SPIKE, EntityType.STONE_SPIKE, EntityType.GOLD_SPIKE, EntityType.DIAMOND_SPIKE, EntityType.AMETHYST_SPIKE, EntityType.REIDITE_SPIKE,
            EntityType.WOOD_WALL, EntityType.STONE_WALL, EntityType.GOLD_WALL, EntityType.DIAMOND_WALL, EntityType.AMETHYST_WALL, EntityType.REIDITE_WALL,
            EntityType.WOOD_DOOR, EntityType.STONE_DOOR, EntityType.GOLD_DOOR, EntityType.DIAMOND_DOOR, EntityType.AMETHYST_DOOR, EntityType.REIDITE_DOOR,
            EntityType.WOOD_DOOR_SPIKE, EntityType.STONE_DOOR_SPIKE, EntityType.GOLD_DOOR_SPIKE, EntityType.DIAMOND_DOOR_SPIKE, EntityType.AMETHYST_DOOR_SPIKE, EntityType.REIDITE_DOOR_SPIKE,
            EntityType.BRIDGE, EntityType.ROOF, EntityType.EMERALD_MACHINE
        ].includes(this.type);
    }

    public isDoor() {
        return [
            EntityType.WOOD_DOOR, EntityType.STONE_DOOR, EntityType.GOLD_DOOR, EntityType.DIAMOND_DOOR, EntityType.AMETHYST_DOOR, EntityType.REIDITE_DOOR,
            EntityType.WOOD_DOOR_SPIKE, EntityType.STONE_DOOR_SPIKE, EntityType.GOLD_DOOR_SPIKE, EntityType.DIAMOND_DOOR_SPIKE, EntityType.AMETHYST_DOOR_SPIKE, EntityType.REIDITE_DOOR_SPIKE
        ].includes(this.type);
    }

    public isSeed() {
        return [
            EntityType.BERRY_SEED, EntityType.WHEAT_SEED, EntityType.CARROT_SEED, EntityType.TOMATO_SEED,
            EntityType.THORNBUSH_SEED, EntityType.GARLIC_SEED, EntityType.WATERMELON_SEED, EntityType.PUMPKIN_SEED
        ].includes(this.type);
    }

    public noCheck() {
        return [
            EntityType.BRIDGE, EntityType.ROOF, EntityType.TOWER
        ].includes(this.type);
    }

    public serialize() {
        return [
            this.type, this.id, this.owner ? this.owner.id : 0, Math.floor(this.position.x), Math.floor(this.position.y), this.angle, this.info, this.action, this.speed,
            this.extra, this.health,
            this.createdAt, this.data, Array.from(this.timestamps.entries()).map(([key, stamp]) => [key, stamp.time]),
        ];
    }
}