"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bullet = void 0;
const entity_1 = require("./entity");
const entity_type_1 = require("../enums/types/entity.type");
const player_1 = __importDefault(require("./player"));
const utils_1 = require("../modules/utils");
const action_type_1 = require("../enums/types/action.type");
const building_1 = __importDefault(require("../building/building"));
const tile_1 = require("../world/tile");
const physics_utils_1 = __importDefault(require("../physics/physics.utils"));
const health_system_1 = __importDefault(require("../attributes/health.system"));
const state_type_1 = require("../enums/types/state.type");
var ArrowData;
(function (ArrowData) {
    ArrowData[ArrowData["SPEED"] = 0] = "SPEED";
    ArrowData[ArrowData["DISTANCE"] = 1] = "DISTANCE";
    ArrowData[ArrowData["DAMAGE"] = 2] = "DAMAGE";
    ArrowData[ArrowData["ENTITY_DAMAGE"] = 3] = "ENTITY_DAMAGE";
})(ArrowData || (ArrowData = {}));
class Bullet extends entity_1.Entity {
    owner;
    pos;
    flight;
    distance;
    data;
    constructor(server, owner, type) {
        super(entity_type_1.EntityType.SPELL, server);
        this.data = this.getArrowData(type);
        this.distance = 0;
        this.speed = this.data[ArrowData.SPEED];
        this.pos = owner.realPosition.clone();
        this.realPosition.set(owner.realPosition);
        this.position.set(utils_1.Utils.getOffsetVector(owner.realPosition, this.data[ArrowData.DISTANCE], owner.angle).clamp(1, 1, this.server.world.width - 1, this.server.world.height - 1));
        this.info = owner.realPosition.x - (owner.realPosition.x & 0xf) + type;
        this.extra = Math.floor(owner.realPosition.y);
        this.flight = owner.flight;
        if (this.flight || owner.hasState(state_type_1.StateType.IN_TOWER)) {
            this.extra |= 1;
            if (owner.hasState(state_type_1.StateType.IN_TOWER))
                this.addState(state_type_1.StateType.IN_TOWER);
        }
        else if ((this.extra & 1) !== 0) {
            this.extra &= ~1;
        }
        this.id = this.server.entityPool.generate();
        this.owner = owner;
        this.angle = owner.angle - 63.75;
        this.server.entities[this.id] = this;
    }
    getArrowData(type) {
        const { config } = this.server;
        switch (type) {
            case 2: return [config.spell_speed_wood_arrow, config.spell_dist_wood_arrow, config.spell_damage_wood_arrow, config.spell_damage_pve_wood_arrow];
            case 3: return [config.spell_speed_stone_arrow, config.spell_dist_stone_arrow, config.spell_damage_stone_arrow, config.spell_damage_pve_stone_arrow];
            case 4: return [config.spell_speed_gold_arrow, config.spell_dist_gold_arrow, config.spell_damage_gold_arrow, config.spell_damage_pve_gold_arrow];
            case 5: return [config.spell_speed_diamond_arrow, config.spell_dist_diamond_arrow, config.spell_damage_diamond_arrow, config.spell_damage_pve_diamond_arrow];
            case 6: return [config.spell_speed_amethyst_arrow, config.spell_dist_amethyst_arrow, config.spell_damage_amethyst_arrow, config.spell_damage_pve_amethyst_arrow];
            case 7: return [config.spell_speed_reidite_arrow, config.spell_dist_reidite_arrow, config.spell_damage_reidite_arrow, config.spell_damage_pve_reidite_arrow];
            case 8: return [config.spell_speed_dragon_arrow, config.spell_dist_dragon_arrow, config.spell_damage_dragon_arrow, config.spell_damage_pve_dragon_arrow];
            case 0: return [0.7, 900, 50, 50];
        }
        return [0, 0, 0, 0];
    }
    onTick() {
        this.distance += this.data[ArrowData.SPEED] * 1000 * this.server.ticker.delta;
        if (this.distance >= this.data[ArrowData.DISTANCE]) {
            return this.delete();
        }
        this.realPosition.set(utils_1.Utils.getOffsetVector(this.pos, this.distance, this.angle + 63.75));
        const colliders = physics_utils_1.default.getColliders(this.server.world, this, 100, 3);
        const isTower = this.hasState(state_type_1.StateType.IN_TOWER);
        if (colliders.length > 0) {
            for (const collider of colliders) {
                if (collider === this.owner || collider.realPosition.distance(this.realPosition) > 10 + collider.radius)
                    continue;
                if (collider instanceof tile_1.Tile && !this.flight) {
                    return this.delete();
                }
                else if (collider instanceof player_1.default && (this.flight === collider.flight || isTower)) {
                    health_system_1.default.damage(collider, this.data[ArrowData.DAMAGE] + collider.bulletDefense, action_type_1.ActionType.HURT, this);
                    return this.delete();
                }
                else if (collider instanceof building_1.default && !this.flight && !(isTower && collider.type !== entity_type_1.EntityType.ROOF)) {
                    health_system_1.default.damage(collider, this.data[ArrowData.DAMAGE], action_type_1.ActionType.HURT, this);
                    this.server.buildingSystem.addShake(this.angle, collider.id);
                    return this.delete();
                }
            }
        }
    }
}
exports.Bullet = Bullet;
