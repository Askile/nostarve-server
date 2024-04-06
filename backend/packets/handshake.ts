import {getDefaultCamera} from "../default/default.values";
import {Client} from "../network/client";
import Player from "../entities/player";
import {Server} from "../server";
import {Utils} from "../modules/utils";
import {ItemType} from "../enums/types/item.type";
import {Permissions} from "../enums/permissions";
import {BOX, SKIN} from "../enums/cosmetics";
import {ClientPackets, ClientStringPackets} from "../enums/packets";
import Master from "../master/master";
import LeaderboardUtils from "../leaderboard/leaderboard.utils";

const MAX_VALUES = {
    SKIN: 175,
    ACCESSORY: 95,
    CRATE: 72,
    BAG: 70,
    BOOK: 45
};

export class Handshake {
    private readonly request: any;
    private readonly client: Client;
    private readonly config: Config;

    private nickname: string;
    public token: string | number;
    public token_id: string | number;
    private readonly skin: number;
    private readonly accessory: number;
    private readonly bag: number;
    private readonly server: Server;
    private readonly book: number;
    private readonly crate: number;
    private readonly dead: number;
    private readonly login: string;
    private readonly password: string;
    constructor(request: any, client: Client) {
        this.server = client.server;
        this.config = client.server.config;
        this.request = request;
        this.client = client;

        this.nickname = request[0];
        this.token = request[1];
        this.token_id = request[2];
        this.skin = request[3];
        this.accessory = request[4];
        this.bag = request[5];
        this.book = request[6];
        this.crate = request[7];
        this.dead = request[8];
        this.login = request[9];
        this.password = request[10];
    }

    public testValid(): boolean {
        const typesToCheck = [
            {type: "string", indices: [0, 1, 2, 9]},
            {type: "number", indices: [3, 4, 5, 6, 7, 8]}
        ];

        for (const {type, indices} of typesToCheck) {
            for (const index of indices) {
                const requestValue = this.request[index];
                const requestType = typeof requestValue;
                if (requestType !== type) return false;
            }
        }

        return true;
    }

    public async setupPlayer(client: Client) {
        const id = this.server.playerPool.generate();
        const player = this.server.players[id - 1];

        if (!this.testValid()) {
            this.server.playerPool.free(player.id);
            return;
        }

        player.client = client;
        client.player = player;
        player.alive = true;
        player.createdAt = Date.now();

        this.server.alivePlayers.push(player);
        this.server.entities[player.id] = player;

        if(!player.account) {
            player.account = await Master.getAccount(this.server, this.login, this.password);
        }

        player.nickname = this.nickname.slice(0, 16) || `restarver#${player.id}`;
        player.token = this.token as string;
        player.token_id = this.token_id as string;
        player.cosmetics.skin = Math.max(0, Math.min(MAX_VALUES.SKIN, this.skin));
        player.cosmetics.accessory = Math.max(0, Math.min(MAX_VALUES.ACCESSORY, this.accessory));
        player.cosmetics.bag = Math.max(0, Math.min(MAX_VALUES.BAG, this.bag));
        player.cosmetics.book = Math.max(0, Math.min(MAX_VALUES.BOOK, this.book));
        player.cosmetics.crate = Math.max(0, Math.min(MAX_VALUES.CRATE, this.crate));
        player.cosmetics.dead = Math.max(0, Math.min(MAX_VALUES.CRATE, this.dead));
        if(player.account) {
            if(this.login === this.server.settings.owner_login || this.server.settings.admins.includes(this.login)) {
                player.permission = Permissions.OWNER;
                player.cosmetics.skin = SKIN.ROBOT;
                player.cosmetics.crate = BOX.BOX_OF_THE_BABY_LAVA;
            }
        }
    }

    public restoreResponse(player: Player) {
        const players = this.server.alivePlayers.map(({id, score, level, nickname, cosmetics}) => {
            return [id, nickname, level, LeaderboardUtils.restoreNumber(score), cosmetics.skin, cosmetics.accessory, cosmetics.book, cosmetics.bag];
        });

        this.client.sendJSON([
            ClientStringPackets.HANDSHAKE,
            this.server.mode,
            player.time,
            player.position.x,
            players,
            this.server.timeSystem.time,
            player.totem ? player.totem.data : [], // TODO: TEAM
            player.id,
            player.position.y,
            this.server.settings.player_limit + 4, // TODO: max players
            0,
            0,//player.tokenScore.score, // TODO: Player score for kits
            player.inventory.items,
            this.server.timeSystem.getGameTime(),
            Date.now() - player.createdAt, // TODO: Quests born
            player.quests, // TODO: Quests
            58085, // Seed
            this.config.important.map_width,
            this.config.important.map_height,
            this.config.important.islands,
            this.config.important.custom_map.length ? this.config.important.custom_map : 0,
            this.server.welcome,
            this.server.craftSystem.crafts,
            0,  // TODO: Sandstorm
            0,  // TODO: Blizzard
            this.server.config.important.market ? this.server.market.orders : 0
        ]);

        if(player.inventory.maxSize >= 11) {
            this.client.sendU8([ClientPackets.GET_BAG]);
        }

        if(this.server.config.disable_clock)
            this.client.sendU8([ClientPackets.HIDE_CLOCK]);
        if(this.server.config.disable_kit)
            this.client.sendU8([ClientPackets.HIDE_SHOP_KIT]);
        if(this.server.config.disable_quest)
            this.client.sendU8([ClientPackets.HIDE_QUEST]);
        if(this.server.config.disable_shop)
            this.client.sendU8([ClientPackets.HIDE_MARKET]);
    }

    public response(player: Player) {
        const players = this.server.alivePlayers.map(({id, level, nickname, cosmetics, score}) => {
            return [id, nickname, level, LeaderboardUtils.restoreNumber(score), cosmetics.skin, cosmetics.accessory, cosmetics.book, cosmetics.bag];
        });

        // const token_id = this.token_id ? this.token_id : Utils.generateRandomString(12);
        // const tokenData = this.server.tokenSystem.getToken(player.data.token_id);

        this.client.sendJSON([
            ClientStringPackets.HANDSHAKE,
            this.server.mode,
            player.time,
            player.position.x,
            players,
            this.server.timeSystem.time,
            player.totem ? player.totem.data : [], // TODO: TEAM
            player.id,
            player.position.y,
            this.server.settings.player_limit + 4, // TODO: max players
            0,
            0,//tokenData ? tokenData.score : 0, // TODO: Player score for kits
            player.inventory.items,
            this.server.timeSystem.getGameTime(),
            0, // TODO: Quests born
            [], // TODO: Quests
            58085, // Seed
            this.config.important.map_width,
            this.config.important.map_height,
            this.config.important.islands,
            this.config.important.custom_map.length ? this.config.important.custom_map : 0,
            this.server.welcome,
            this.server.craftSystem.crafts,
            0,  // TODO: Sandstorm
            0,   // TODO: Blizzard
            this.server.config.important.market ? this.server.market.orders : 0
        ]);

        if(this.server.config.disable_clock)
            this.client.sendU8([ClientPackets.HIDE_CLOCK]);
        if(this.server.config.disable_kit)
            this.client.sendU8([ClientPackets.HIDE_SHOP_KIT]);
        if(this.server.config.disable_quest)
            this.client.sendU8([ClientPackets.HIDE_QUEST]);
        if(this.server.config.disable_shop)
            this.client.sendU8([ClientPackets.HIDE_MARKET]);

    }

    public broadcastCosmetics(player: Player) {
        if(player.account) {
            player.level = 1 + Math.floor(Math.sqrt(player.account.seasons[0].score / 20000));

            if(player.account.kit) {
                player.inventory.increase(ItemType.BOOK, 1, true);
                player.inventory.increase(ItemType.BAG, 1, true);
            }

            this.server.broadcast(Utils.serializeAccountToBuffer(player), true);
        }

        this.server.broadcast(Utils.serializeCosmeticsToJSON(player), false);

        player.updateInfo();
    }
}
