"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const packets_1 = require("../enums/packets");
class PacketSender {
    /**
     * Sends a message to the specified player's client.
     */
    static message(player, message) {
        player?.client?.sendJSON([packets_1.ClientStringPackets.MESSAGE, message]);
    }
    /**
     * Kicks a player with the specified message.
     */
    static kick(player, message) {
        player?.client?.sendJSON([packets_1.ClientStringPackets.KICK, message]);
    }
    /**
     * Sends a welcome message to the player's client.
     */
    static welcome(player, message) {
        player?.client?.sendJSON([packets_1.ClientStringPackets.WELCOME, message]);
    }
    /**
     * Sends a command response to the player's client.
     */
    static command(player, status, type, name = "", description = "") {
        player?.client?.sendJSON([packets_1.ClientStringPackets.COMMAND, name, type, status, description]);
    }
    /**
     * Sends the player's health to the client.
     */
    static health(player) {
        player?.client?.sendU8([packets_1.ClientPackets.GAUGES_LIFE, player.health / 2, player.gauges.bandage]);
    }
    /**
     * Sends a join team packet to the specified player.
     */
    static joinTeam(player) {
        player?.client?.sendU8([packets_1.ClientPackets.JOIN_NEW_TEAM, player.id]);
    }
    /**
     * Sends a new member team packet to the specified player.
     */
    static newMemberTeam(player, id) {
        player?.client?.sendU8([packets_1.ClientPackets.NEW_MEMBER_TEAM, id]);
    }
    /**
     * Sends a destroy team packet to the specified player.
     */
    static destroyTeam(player) {
        player?.client?.sendU8([packets_1.ClientPackets.DESTROY_TEAM]);
    }
    /**
     * Send an exclude team packet to the specified player.
     */
    static excludeTeam(player, id) {
        player?.client?.sendU8([packets_1.ClientPackets.EXCLUDE_TEAM, id]);
    }
    /**
     * Sends a join new team packet to the specified player.
     */
    static joinNewTeam(player, totem) {
        player?.client?.sendU8([packets_1.ClientPackets.JOIN_NEW_TEAM, ...totem.data]);
    }
}
exports.default = PacketSender;
