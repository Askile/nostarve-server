import Player from "../entities/player";
import {BinaryWriter} from "../modules/binary.writer";
import {ActionType} from "../enums/types/action.type";
import {DeathReason} from "../enums/death.reason";
import {WorldTime} from "../enums/world.time";
import {ItemType} from "../enums/types/item.type";
import {BiomeType} from "../enums/types/biome.type";
import { StateType } from "../enums/types/state.type";
import {ClientPackets} from "../enums/packets";
import {GameMode} from "../enums/game.mode";
import HealthSystem from "./health.system";
import TeamSystem from "../team/team.system";
import {EntityType} from "../enums/types/entity.type";
import {ComponentType} from "../enums/types/component.type";

export default class Gauges {
    private readonly config: Config;
    private readonly player: Player;

    public lastUpdateStats: number = Date.now();
    public lastUpdateHealth: number = Date.now();
    public lastUpdateLava: number = Date.now();
    public lastUpdateSpike: number = Date.now();
    public lastUpdateFire: number = Date.now();

    public hunger: number;
    public cold: number;
    public thirst: number;
    public oxygen: number;
    public bandage: number;
    public old: any;

    constructor(player: Player) {
        this.player = player;
        this.config = player.server.config;

        this.hunger = 100;
        this.cold = 100;
        this.thirst = 100;
        this.oxygen = 100;
        this.bandage = 0;

        this.old = {
            hunger: this.hunger,
            cold: this.cold,
            thirst: this.thirst,
            oxygen: this.oxygen,
            bandage: this.bandage
        }
    }

    public updateClientGauges() {
        if(!this.player.client) return;

        const writer = new BinaryWriter(8);
        writer.writeUInt8(ClientPackets.GAUGES);
        writer.writeUInt8(this.player.health / 2);
        writer.writeUInt8(this.hunger);
        writer.writeUInt8(Math.min(100, this.cold));
        writer.writeUInt8(this.thirst);
        writer.writeUInt8(this.oxygen);
        writer.writeUInt8(200 - this.cold);
        writer.writeUInt8(this.bandage);

        this.player.client.sendBinary(writer.toBuffer());
    }

    public reset() {
        const now = Date.now();

        this.lastUpdateHealth = now;
        this.lastUpdateStats = now;
        this.lastUpdateLava = now;
        this.lastUpdateSpike = now;
        this.lastUpdateFire = now;

        this.hunger = 100;
        this.cold = 100;
        this.thirst = 100;
        this.oxygen = 100;
        this.bandage = 0;
        this.old = {
            hunger: this.hunger,
            cold: this.cold,
            thirst: this.thirst,
            oxygen: this.oxygen,
            bandage: this.bandage
        }
    }

    public tick() {
        const now = Date.now();
        if (now - this.lastUpdateHealth >= this.config.delay_gauges * 2) {
            this.lastUpdateHealth = now;
            this.updateHealth();
        }

        if (now - this.lastUpdateStats >= this.config.delay_gauges) {
            this.lastUpdateStats = now;
            this.updateGauges();
        }

        if (now - this.lastUpdateFire >= 2000) {
            this.lastUpdateFire = now;
            this.updateFire();
        }

        if (now - this.lastUpdateLava >= 750) {
            this.lastUpdateLava = now;
            this.updateLava();
        }

        if (now - this.lastUpdateSpike >= 1000) {
            this.lastUpdateSpike = now;
            this.updateSpike();
        }
    }

    public clamp() {
        this.cold = Math.clamp(this.cold, 0, 100 + Number(!this.config.disable_warm_gauge) * 100);
        this.hunger = Math.clamp(this.hunger, 0, 100);
        this.thirst = Math.clamp(this.thirst, 0, 100);
        this.oxygen = Math.clamp(this.oxygen, 0, 100);
        this.bandage = Math.clamp(this.bandage, 0, this.config.bandage_stack_limit);
    }

    public updateGauges() {
        let helmet: string | false = ItemType[this.player.helmet.id].toLowerCase() ?? false;
        if (helmet === "hand") helmet = false;
        if (helmet && helmet.includes("protection")) {
            if (helmet.includes("diamond")) helmet = 'warm_protection';
            if (helmet.includes("amethyst")) helmet = 'warm_protection2';
            if (helmet.includes("reidite")) helmet = 'warm_protection3';
        }

        const cfg = (this.config as any);

        if (this.player.hasState(StateType.FIRE) && !this.player.hasState(StateType.IN_FIRE)) {
            this.cold += this.config.fire_warm;
        } else {
            const time: string = WorldTime[this.player.server.timeSystem.time].toLowerCase();
            let biomeIn = BiomeType.FOREST;
            if (this.player.hasState(StateType.IN_DESERT)) biomeIn = BiomeType.DESERT;
            if (this.player.hasState(StateType.IN_WINTER)) biomeIn = BiomeType.WINTER;
            if (this.player.hasState(StateType.IN_LAVA_BIOME)) biomeIn = BiomeType.LAVA;
            if (this.player.hasState(StateType.IN_FOREST)) biomeIn = BiomeType.FOREST;
            if (this.player.hasState(StateType.IN_CAVE)) biomeIn = BiomeType.DRAGON;
            if (this.player.hasState(StateType.IN_OCEAN)) biomeIn = BiomeType.SEA;
            let biome: string | boolean = BiomeType[biomeIn].toLowerCase() ?? false;
            let configSetting: number, reduceSetting: number, increase: boolean;
            if (biome === 'sea') biome = "water";
            else if (biome === 'dragon') biome = "winter";
            else if (biome === 'forest' || biome === 'beach') biome = false;
            if (biome) {
                if (helmet) {
                    configSetting = cfg[helmet + "_warm_" + biome + "_" + time] ?? 0;
                } else {
                    configSetting = cfg["warm_" + biome + "_" + time] ?? 0;
                }
                increase = biome === 'desert' || biome === 'lava';
                reduceSetting = cfg[(increase) ? "increase_" + "cold_" + biome + (biome === 'desert' ? "_" + time : "") : "reduce_" + "cold_" + biome + "_" + time] / (Number(this.player.hasState(StateType.IN_ROOF)) + 1) ?? 0
            } else {
                if (helmet) {
                    configSetting = cfg[helmet + "_warm_" + time] ?? 0;
                } else {
                    configSetting = cfg["warm_" + time] ?? 0;
                }
                increase = false;
                reduceSetting = cfg["reduce_cold_" + time] / (Number(this.player.hasState(StateType.IN_ROOF)) + 1) ?? 0;
            }

            if (increase) {
                this.cold += reduceSetting;
                this.cold -= configSetting;
            } else {
                time === 'night' ? this.cold -= reduceSetting : this.cold -= reduceSetting - configSetting;
                this.cold += configSetting;
            }
        }

        if(this.player.server.mode !== GameMode.forest) {
            if (this.player.hasState(StateType.IN_WATER)  && !this.player.flight) {
                this.thirst += this.config.drink_water;
                this.oxygen -= this.player.hasState(StateType.IN_BRIDGE) ? -this.config.heal_oxygen : this.config.reduce_oxygen - (cfg[helmet + "_loss_oxygen"] ?? 0);
            } else {
                this.thirst -= this.player.hasState(StateType.IN_BRIDGE) ? this.config.reduce_water_bed : this.config.reduce_water;
                this.oxygen += this.config.heal_oxygen;
            }
        }

        this.hunger = Math.clamp(this.hunger - (this.player.hasState(StateType.IN_BED) ? this.config.reduce_food_bed : this.config.reduce_food), 0, 100);
        this.thirst = Math.clamp(this.thirst, 0, 100);
        this.oxygen = Math.clamp(this.oxygen, 0, 100);
        this.cold = Math.clamp(this.cold, 0, 100 + Number(!this.config.disable_warm_gauge) * 100);

        if (this.old.cold === 200 && this.cold === 200) {
            HealthSystem.damage(this.player, this.config.damage_warm, ActionType.HURT);
            this.player.reason = DeathReason.WARM;
        }

        if (this.old.hunger === 0 && this.hunger === 0) {
            this.player.reason = DeathReason.STARVE;
            HealthSystem.damage(this.player, this.config.damage_food, ActionType.HUNGER);
        }

        if (this.old.cold === 0 && this.cold === 0) {
            this.player.reason = DeathReason.COLD;
            HealthSystem.damage(this.player, this.player.hasState(StateType.IN_WINTER) ? this.config.damage_cold_winter : this.config.damage_cold, ActionType.COLD);
        }

        if (this.old.thirst === 0 && this.thirst === 0) {
            this.player.reason = DeathReason.WATER;
            HealthSystem.damage(this.player, this.config.damage_water, ActionType.COLD);
        }

        if (this.old.oxygen === 0 && this.oxygen === 0) {
            this.player.reason = DeathReason.OXYGEN;
            HealthSystem.damage(this.player, this.config.damage_water, ActionType.COLD);
        }

        if (this.queryUpdate()) {
            this.updateClientGauges();
        }
    }

    private updateFire() {
        if (this.player.hasState(StateType.IN_FIRE) && !this.player.flight) {
            this.cold += 20;
            this.cold = Math.clamp(this.cold, 0, 100 + Number(!this.config.disable_warm_gauge) * 100);
            HealthSystem.damage(this.player, 40, ActionType.HURT);
            this.updateGauges();
        }
    }

    private updateLava() {
        if (this.player.hasState(StateType.IN_LAVA) && !this.player.hasState(StateType.IN_BRIDGE) && !this.player.flight) {
            this.cold = Math.clamp(this.cold + 20, 0, 100 + Number(!this.config.disable_warm_gauge) * 100);
            HealthSystem.damage(this.player, 40, ActionType.HURT);
            this.updateGauges();
        }
    }

    private updateSpike() {
        const spike = this.player.server.world.getObjectWithDamage(this.player, 100);
        if (spike && !this.player.flight) {
            this.player.reason = DeathReason.SPIKE;
            HealthSystem.damage(this.player, spike.getComponent(ComponentType.DAMAGE), ActionType.HURT);
        }
    }

    private updateHealth() {
        const canHeal =
            this.hunger > 35 &&
            this.cold > 35 &&
            this.cold < 165 &&
            this.thirst > 35 &&
            this.oxygen > 35

        if (!canHeal || this.player.health === 200) return;

        if(this.player.helmet.id === ItemType.CROWN_GREEN) {
            HealthSystem.heal(this.player, this.config.crown_green_heal);
        } else if(this.player.hasState(StateType.IN_BED)) {
            HealthSystem.heal(this.player, 30);
        } else if(this.bandage) {
            this.bandage--;

            HealthSystem.heal(this.player, this.config.bandage_heal);
            this.player.client.sendU8([ClientPackets.BANDAGE, this.bandage]);
        } else {
            HealthSystem.heal(this.player, this.config.heal);
        }
    }

    private queryUpdate() {
        const hasUpdate =
            this.old.hunger !== this.hunger ||
            this.old.cold !== this.cold ||
            this.old.thirst !== this.thirst ||
            this.old.oxygen !== this.oxygen ||
            this.old.bandage !== this.bandage;

        if (hasUpdate) {
            this.old = {
                hunger: this.hunger,
                cold: this.cold,
                thirst: this.thirst,
                oxygen: this.oxygen,
                bandage: this.bandage
            };
        }

        return hasUpdate;
    }
}