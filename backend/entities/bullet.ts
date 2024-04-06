import {Entity} from "./entity";
import {EntityType} from "../enums/types/entity.type";
import {Server} from "../server";
import Player from "./player";
import {Vector} from "../modules/vector";
import {Utils} from "../modules/utils";
import {ActionType} from "../enums/types/action.type";
import Building from "../building/building";
import {Tile} from "../world/tile";
import PhysicsUtils from "../physics/physics.utils";
import HealthSystem from "../attributes/health.system";
import {StateType} from "../enums/types/state.type";
import {ComponentType} from "../enums/types/component.type";

enum ArrowData {
    SPEED,
    DISTANCE,
    DAMAGE,
    ENTITY_DAMAGE
}

export class Bullet extends Entity {
    public owner: Player;
    public pos: Vector;
    public flight: boolean;
    public distance: number;
    public data: number[];
    constructor(server: Server, owner: Player, type: number) {
        super(EntityType.SPELL, server);

        this.data = this.getArrowData(type);
        this.distance = 0;
        this.speed = this.data[ArrowData.SPEED];
        this.pos = owner.realPosition.clone();
        this.realPosition.set(owner.realPosition);
        this.position.set(Utils.getOffsetVector(owner.realPosition, this.data[ArrowData.DISTANCE], owner.angle).clamp(1, 1, this.server.world.width - 1, this.server.world.height - 1));

        this.info = owner.realPosition.x - (owner.realPosition.x & 0xf) + type;
        this.extra = Math.floor(owner.realPosition.y);

        this.flight = owner.flight;
        if(this.flight || owner.hasState(StateType.IN_TOWER)) {
            this.extra |= 1;
            if (owner.hasState(StateType.IN_TOWER)) this.addState(StateType.IN_TOWER);
        } else if((this.extra & 1) !== 0) {
            this.extra &= ~1;
        }

        this.id = this.server.entityPool.generate();
        this.owner = owner;
        this.angle = owner.angle - 63.75;

        this.server.entities[this.id] = this;
    }

    private getArrowData(type: number) {
        const {config} = this.server;
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

    public onTick() {
        this.distance += this.data[ArrowData.SPEED] * 1000 * this.server.ticker.delta;

        if(this.distance >= this.data[ArrowData.DISTANCE]) {
            return this.delete();
        }

        this.realPosition.set(Utils.getOffsetVector(this.pos, this.distance, this.angle + 63.75));

        const colliders = PhysicsUtils.getColliders(this.server.world, this, 100, 3);
        const isTower = this.hasState(StateType.IN_TOWER);
        if(colliders.length > 0) {
            for (const collider of colliders) {
                if(collider === this.owner || collider.realPosition.distance(this.realPosition) > 10 + collider.radius) continue;
                if(collider instanceof Tile && !this.flight) {
                    return this.delete();
                } else if(collider instanceof Player && (this.flight === collider.flight || isTower)) {
                    HealthSystem.damage(collider, this.data[ArrowData.DAMAGE] + collider.bulletDefense, ActionType.HURT, this);
                    return this.delete();
                } else if(collider instanceof Building && !this.flight && !(isTower && collider.type !== EntityType.ROOF)) {
                    HealthSystem.damage(collider, this.data[ArrowData.DAMAGE], ActionType.HURT, this);
                    this.server.buildingSystem.addShake(this.angle, collider.id);
                    return this.delete();
                }
            }
        }
    }
}