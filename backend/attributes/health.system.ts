import {Entity} from "../entities/entity";
import Building from "../building/building";
import Player from "../entities/player";
import {ActionType} from "../enums/types/action.type";
import {EntityType} from "../enums/types/entity.type";
import PacketSender from "../network/packet.sender";
import {StateType} from "../enums/types/state.type";

export default class HealthSystem {
    public static damage(entity: Entity, amount: number, action?: number, damager?: Entity) {
        if(!entity.server.loaded) return;
        if (entity.type === EntityType.PLAYER && (entity.hasState(StateType.GOD_MODE) || Date.now() - entity.createdAt < 8000)) return
        entity.addAction(action);
        if (amount < 0) return;

        entity.health = Math.max(0, entity.health - amount);

        if (entity.health <= 0) {
            entity.delete();
            entity.onDead(damager);
            if (entity.type === EntityType.PLAYER && damager instanceof Player) {
                damager.kills++;
            }
        }

        entity.onDamage(damager);

        if (entity.type === EntityType.PLAYER) {
            PacketSender.health(entity as Player);
        }
    }

    public static heal(entity: Entity, amount: number) {
        if (amount < 0) return;

        entity.health = Math.min(entity.server.configSystem.health[entity.type], entity.health + amount);

        if (entity.type === EntityType.PLAYER && entity.health) {
            PacketSender.health(entity as Player);
        }

        if (!(entity instanceof Building)) {
            entity.addAction(ActionType.HEAL);
        } else {
            entity.updateInfo();
        }
    }
}