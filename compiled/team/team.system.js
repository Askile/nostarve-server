"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const packet_sender_1 = __importDefault(require("../network/packet.sender"));
const entity_type_1 = require("../enums/types/entity.type");
class TeamSystem {
    server;
    constructor(server) {
        this.server = server;
    }
    joinTeam(player) {
        const totem = player.nearestBuildings[entity_type_1.EntityType.TOTEM];
        if (!totem ||
            totem.info ||
            totem.realPosition.distance(player.realPosition) > 100 ||
            player.totem ||
            Date.now() - player.timestamps.get("join_totem") < 30000)
            return;
        player.totem = totem;
        player.timestamps.set("join_totem", Date.now());
        for (const i of player.totem.data) {
            packet_sender_1.default.newMemberTeam(this.server.players[i - 1], player.id);
        }
        player.totem.data.push(player.id);
        packet_sender_1.default.joinNewTeam(player, totem);
    }
    kickTeam(player, id) {
        const p = this.server.players[id - 1];
        if (!Number.isInteger(id) || !player.totem || !p.totem || player.id === id || player.totem.owner !== player)
            return;
        this.excludeMemberId(player.totem, id);
        p.totem = undefined;
    }
    leaveTeam(player) {
        if (!player.totem || player.totem.owner === player)
            return;
        this.excludeMemberId(player.totem, player.id);
        player.totem = undefined;
    }
    lockTeam(player) {
        if (!player.totem || player.totem.owner !== player)
            return;
        player.totem.info = Number(!player.totem.info);
    }
    destroyTeam(totem) {
        const now = Date.now();
        for (const id of totem.data) {
            const player = this.server.players[id - 1];
            player.totem = undefined;
            player.timestamps.set("join_totem", now);
            packet_sender_1.default.destroyTeam(this.server.players[id - 1]);
        }
    }
    excludeMemberId(totem, id) {
        for (const i of totem.data) {
            packet_sender_1.default.excludeTeam(this.server.players[i - 1], id);
        }
        totem.data = totem.data.filter(i => i !== id);
    }
    static isAlly(target, entity) {
        if (!entity || !target)
            return false;
        return target.id === entity.id || target.totem?.data?.includes(entity.id);
    }
    static isEnemy(target, entity) {
        if (!entity || !target)
            return false;
        return target.id !== entity.id && !target.totem?.data?.includes(entity.id);
    }
}
exports.default = TeamSystem;
