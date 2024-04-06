"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const binary_writer_1 = require("../modules/binary.writer");
const action_type_1 = require("../enums/types/action.type");
const death_reason_1 = require("../enums/death.reason");
const world_time_1 = require("../enums/world.time");
const item_type_1 = require("../enums/types/item.type");
const biome_type_1 = require("../enums/types/biome.type");
const state_type_1 = require("../enums/types/state.type");
const packets_1 = require("../enums/packets");
const game_mode_1 = require("../enums/game.mode");
const health_system_1 = __importDefault(require("./health.system"));
class Gauges {
    config;
    player;
    lastUpdateStats = Date.now();
    lastUpdateHealth = Date.now();
    lastUpdateLava = Date.now();
    lastUpdateSpike = Date.now();
    lastUpdateFire = Date.now();
    hunger;
    cold;
    thirst;
    oxygen;
    bandage;
    old;
    constructor(player) {
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
        };
    }
    updateClientGauges() {
        if (!this.player.client)
            return;
        const writer = new binary_writer_1.BinaryWriter(8);
        writer.writeUInt8(packets_1.ClientPackets.GAUGES);
        writer.writeUInt8(this.player.health / 2);
        writer.writeUInt8(this.hunger);
        writer.writeUInt8(Math.min(100, this.cold));
        writer.writeUInt8(this.thirst);
        writer.writeUInt8(this.oxygen);
        writer.writeUInt8(200 - this.cold);
        writer.writeUInt8(this.bandage);
        this.player.client.sendBinary(writer.toBuffer());
    }
    reset() {
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
        };
    }
    tick() {
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
    clamp() {
        this.cold = Math.clamp(this.cold, 0, 100 + Number(!this.config.disable_warm_gauge) * 100);
        this.hunger = Math.clamp(this.hunger, 0, 100);
        this.thirst = Math.clamp(this.thirst, 0, 100);
        this.oxygen = Math.clamp(this.oxygen, 0, 100);
        this.bandage = Math.clamp(this.bandage, 0, this.config.bandage_stack_limit);
    }
    updateGauges() {
        let helmet = item_type_1.ItemType[this.player.helmet.id].toLowerCase() ?? false;
        if (helmet === "hand")
            helmet = false;
        if (helmet && helmet.includes("protection")) {
            if (helmet.includes("diamond"))
                helmet = 'warm_protection';
            if (helmet.includes("amethyst"))
                helmet = 'warm_protection2';
            if (helmet.includes("reidite"))
                helmet = 'warm_protection3';
        }
        const cfg = this.config;
        if (this.player.hasState(state_type_1.StateType.FIRE) && !this.player.hasState(state_type_1.StateType.IN_FIRE)) {
            this.cold += this.config.fire_warm;
        }
        else {
            const time = world_time_1.WorldTime[this.player.server.timeSystem.time].toLowerCase();
            let biomeIn = biome_type_1.BiomeType.FOREST;
            if (this.player.hasState(state_type_1.StateType.IN_DESERT))
                biomeIn = biome_type_1.BiomeType.DESERT;
            if (this.player.hasState(state_type_1.StateType.IN_WINTER))
                biomeIn = biome_type_1.BiomeType.WINTER;
            if (this.player.hasState(state_type_1.StateType.IN_LAVA_BIOME))
                biomeIn = biome_type_1.BiomeType.LAVA;
            if (this.player.hasState(state_type_1.StateType.IN_FOREST))
                biomeIn = biome_type_1.BiomeType.FOREST;
            if (this.player.hasState(state_type_1.StateType.IN_CAVE))
                biomeIn = biome_type_1.BiomeType.DRAGON;
            if (this.player.hasState(state_type_1.StateType.IN_OCEAN))
                biomeIn = biome_type_1.BiomeType.SEA;
            let biome = biome_type_1.BiomeType[biomeIn].toLowerCase() ?? false;
            let configSetting, reduceSetting, increase;
            if (biome === 'sea')
                biome = "water";
            else if (biome === 'dragon')
                biome = "winter";
            else if (biome === 'forest' || biome === 'beach')
                biome = false;
            if (biome) {
                if (helmet) {
                    configSetting = cfg[helmet + "_warm_" + biome + "_" + time] ?? 0;
                }
                else {
                    configSetting = cfg["warm_" + biome + "_" + time] ?? 0;
                }
                increase = biome === 'desert' || biome === 'lava';
                reduceSetting = cfg[(increase) ? "increase_" + "cold_" + biome + (biome === 'desert' ? "_" + time : "") : "reduce_" + "cold_" + biome + "_" + time] / (Number(this.player.hasState(state_type_1.StateType.IN_ROOF)) + 1) ?? 0;
            }
            else {
                if (helmet) {
                    configSetting = cfg[helmet + "_warm_" + time] ?? 0;
                }
                else {
                    configSetting = cfg["warm_" + time] ?? 0;
                }
                increase = false;
                reduceSetting = cfg["reduce_cold_" + time] / (Number(this.player.hasState(state_type_1.StateType.IN_ROOF)) + 1) ?? 0;
            }
            if (increase) {
                this.cold += reduceSetting;
                this.cold -= configSetting;
            }
            else {
                time === 'night' ? this.cold -= reduceSetting : this.cold -= reduceSetting - configSetting;
                this.cold += configSetting;
            }
        }
        if (this.player.server.mode !== game_mode_1.GameMode.forest) {
            if (this.player.hasState(state_type_1.StateType.IN_WATER) && !this.player.flight) {
                this.thirst += this.config.drink_water;
                this.oxygen -= this.player.hasState(state_type_1.StateType.IN_BRIDGE) ? -this.config.heal_oxygen : this.config.reduce_oxygen - (cfg[helmet + "_loss_oxygen"] ?? 0);
            }
            else {
                this.thirst -= this.player.hasState(state_type_1.StateType.IN_BRIDGE) ? this.config.reduce_water_bed : this.config.reduce_water;
                this.oxygen += this.config.heal_oxygen;
            }
        }
        this.hunger = Math.clamp(this.hunger - (this.player.hasState(state_type_1.StateType.IN_BED) ? this.config.reduce_food_bed : this.config.reduce_food), 0, 100);
        this.thirst = Math.clamp(this.thirst, 0, 100);
        this.oxygen = Math.clamp(this.oxygen, 0, 100);
        this.cold = Math.clamp(this.cold, 0, 100 + Number(!this.config.disable_warm_gauge) * 100);
        if (this.old.cold === 200 && this.cold === 200) {
            health_system_1.default.damage(this.player, this.config.damage_warm, action_type_1.ActionType.HURT);
            this.player.reason = death_reason_1.DeathReason.WARM;
        }
        if (this.old.hunger === 0 && this.hunger === 0) {
            this.player.reason = death_reason_1.DeathReason.STARVE;
            health_system_1.default.damage(this.player, this.config.damage_food, action_type_1.ActionType.HUNGER);
        }
        if (this.old.cold === 0 && this.cold === 0) {
            this.player.reason = death_reason_1.DeathReason.COLD;
            health_system_1.default.damage(this.player, this.player.hasState(state_type_1.StateType.IN_WINTER) ? this.config.damage_cold_winter : this.config.damage_cold, action_type_1.ActionType.COLD);
        }
        if (this.old.thirst === 0 && this.thirst === 0) {
            this.player.reason = death_reason_1.DeathReason.WATER;
            health_system_1.default.damage(this.player, this.config.damage_water, action_type_1.ActionType.COLD);
        }
        if (this.old.oxygen === 0 && this.oxygen === 0) {
            this.player.reason = death_reason_1.DeathReason.OXYGEN;
            health_system_1.default.damage(this.player, this.config.damage_water, action_type_1.ActionType.COLD);
        }
        if (this.queryUpdate()) {
            this.updateClientGauges();
        }
    }
    updateFire() {
        if (this.player.hasState(state_type_1.StateType.IN_FIRE) && !this.player.flight) {
            this.cold += 20;
            this.cold = Math.clamp(this.cold, 0, 100 + Number(!this.config.disable_warm_gauge) * 100);
            health_system_1.default.damage(this.player, 40, action_type_1.ActionType.HURT);
            this.updateGauges();
        }
    }
    updateLava() {
        if (this.player.hasState(state_type_1.StateType.IN_LAVA) && !this.player.hasState(state_type_1.StateType.IN_BRIDGE) && !this.player.flight) {
            this.cold = Math.clamp(this.cold + 20, 0, 100 + Number(!this.config.disable_warm_gauge) * 100);
            health_system_1.default.damage(this.player, 40, action_type_1.ActionType.HURT);
            this.updateGauges();
        }
    }
    updateSpike() {
        const spike = this.player.server.world.getObjectWithDamage(this.player, 100);
        if (spike && !this.player.flight) {
            this.player.reason = death_reason_1.DeathReason.SPIKE;
            health_system_1.default.damage(this.player, spike.getComponent("DAMAGE" /* ComponentType.DAMAGE */), action_type_1.ActionType.HURT);
        }
    }
    updateHealth() {
        const canHeal = this.hunger > 35 &&
            this.cold > 35 &&
            this.cold < 165 &&
            this.thirst > 35 &&
            this.oxygen > 35;
        if (!canHeal || this.player.health === 200)
            return;
        if (this.player.helmet.id === item_type_1.ItemType.CROWN_GREEN) {
            health_system_1.default.heal(this.player, this.config.crown_green_heal);
        }
        else if (this.player.hasState(state_type_1.StateType.IN_BED)) {
            health_system_1.default.heal(this.player, 30);
        }
        else if (this.bandage) {
            this.bandage--;
            health_system_1.default.heal(this.player, this.config.bandage_heal);
            this.player.client.sendU8([packets_1.ClientPackets.BANDAGE, this.bandage]);
        }
        else {
            health_system_1.default.heal(this.player, this.config.heal);
        }
    }
    queryUpdate() {
        const hasUpdate = this.old.hunger !== this.hunger ||
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
exports.default = Gauges;
