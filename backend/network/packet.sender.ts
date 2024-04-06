import Player from "../entities/player";
import {ClientPackets, ClientStringPackets} from "../enums/packets";
import Building from "../building/building";

export default class PacketSender {
    /**
     * Sends a message to the specified player's client.
     */
    public static message(player: Player, message: string) {
        player?.client?.sendJSON([ClientStringPackets.MESSAGE, message]);
    }
    /**
     * Kicks a player with the specified message.
     */
    public static kick(player: Player, message: string) {
        player?.client?.sendJSON([ClientStringPackets.KICK, message]);
    }
    /**
     * Sends a welcome message to the player's client.
     */
    public static welcome(player: Player, message: string) {
        player?.client?.sendJSON([ClientStringPackets.WELCOME, message]);
    }
    /**
     * Sends a command response to the player's client.
     */
    public static command(player: Player, status: string, type: boolean, name: string = "", description: string = "") {
        player?.client?.sendJSON([ClientStringPackets.COMMAND, name, type, status, description]);
    }
    /**
     * Sends the player's health to the client.
     */
    public static health(player: Player) {
        player?.client?.sendU8([ClientPackets.GAUGES_LIFE, player.health / 2, player.gauges.bandage]);
    }

    /**
     * Sends a join team packet to the specified player.
     */
    public static joinTeam(player: Player) {
        player?.client?.sendU8([ClientPackets.JOIN_NEW_TEAM, player.id]);
    }

    /**
     * Sends a new member team packet to the specified player.
     */
    public static newMemberTeam(player: Player, id: number) {
        player?.client?.sendU8([ClientPackets.NEW_MEMBER_TEAM, id]);
    }

    /**
     * Sends a destroy team packet to the specified player.
     */
    public static destroyTeam(player: Player) {
        player?.client?.sendU8([ClientPackets.DESTROY_TEAM]);
    }

    /**
     * Send an exclude team packet to the specified player.
     */
    public static excludeTeam(player: Player, id: number) {
        player?.client?.sendU8([ClientPackets.EXCLUDE_TEAM, id]);
    }

    /**
     * Sends a join new team packet to the specified player.
     */
    public static joinNewTeam(player: Player, totem: Building) {
        player?.client?.sendU8([ClientPackets.JOIN_NEW_TEAM, ...totem.data]);
    }
}