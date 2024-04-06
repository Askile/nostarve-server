import Player from "../entities/player";
import PacketSender from "../network/packet.sender";
import {Server} from "../server";
import Building from "../building/building";
import {Entity} from "../entities/entity";
import {EntityType} from "../enums/types/entity.type";

export default class TeamSystem {
    public server: Server;
    constructor(server: Server) {
        this.server = server;
    }

    public joinTeam(player: Player) {
        const totem = player.nearestBuildings[EntityType.TOTEM];
        if(
            !totem ||
            totem.info ||
            totem.realPosition.distance(player.realPosition) > 100 ||
            player.totem ||
            Date.now() - player.timestamps.get("join_totem") < 30000
        ) return;

        player.totem = totem;
        player.timestamps.set("join_totem", Date.now());

        for (const i of player.totem.data) {
            PacketSender.newMemberTeam(this.server.players[i - 1], player.id);
        }

        player.totem.data.push(player.id);
        PacketSender.joinNewTeam(player, totem);
    }

    public kickTeam(player: Player, id: number) {
        const p = this.server.players[id - 1];
        if(!Number.isInteger(id) || !player.totem || !p.totem || player.id === id || player.totem.owner !== player)  return;

        this.excludeMemberId(player.totem, id);
        p.totem = undefined;
    }

    public leaveTeam(player: Player) {
        if(!player.totem || player.totem.owner === player) return;

        this.excludeMemberId(player.totem, player.id);

        player.totem = undefined;
    }

    public lockTeam(player: Player) {
        if(!player.totem || player.totem.owner !== player) return;

        player.totem.info = Number(!player.totem.info);
    }

    public destroyTeam(totem: Building) {
        const now = Date.now();
        for (const id of totem.data) {
            const player = this.server.players[id - 1];
            player.totem = undefined;
            player.timestamps.set("join_totem", now);
            PacketSender.destroyTeam(this.server.players[id - 1]);
        }
    }

    public excludeMemberId(totem: Building, id: number) {
        for (const i of totem.data) {
            PacketSender.excludeTeam(this.server.players[i - 1], id);
        }

        totem.data = totem.data.filter(i => i !== id);
    }

    public static isAlly(target: Player, entity: Entity) {
        if(!entity || !target) return false;
        return target.id === entity.id || target.totem?.data?.includes(entity.id);
    }

    public static isEnemy(target: Player, entity: Entity) {
        if(!entity || !target) return false;
        return target.id !== entity.id && !target.totem?.data?.includes(entity.id);
    }
}