"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Handshake = void 0;
const utils_1 = require("../modules/utils");
const item_type_1 = require("../enums/types/item.type");
const permissions_1 = require("../enums/permissions");
const cosmetics_1 = require("../enums/cosmetics");
const packets_1 = require("../enums/packets");
const master_1 = __importDefault(require("../master/master"));
const leaderboard_utils_1 = __importDefault(require("../leaderboard/leaderboard.utils"));
const MAX_VALUES = {
    SKIN: 175,
    ACCESSORY: 95,
    CRATE: 72,
    BAG: 70,
    BOOK: 45
};
class Handshake {
    request;
    client;
    config;
    nickname;
    token;
    token_id;
    skin;
    accessory;
    bag;
    server;
    book;
    crate;
    dead;
    login;
    password;
    constructor(request, client) {
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
    testValid() {
        const typesToCheck = [
            { type: "string", indices: [0, 1, 2, 9] },
            { type: "number", indices: [3, 4, 5, 6, 7, 8] }
        ];
        for (const { type, indices } of typesToCheck) {
            for (const index of indices) {
                const requestValue = this.request[index];
                const requestType = typeof requestValue;
                if (requestType !== type)
                    return false;
            }
        }
        return true;
    }
    async setupPlayer(client) {
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
        if (!player.account) {
            player.account = await master_1.default.getAccount(this.server, this.login, this.password);
        }
        player.nickname = this.nickname.slice(0, 16) || `restarver#${player.id}`;
        player.token = this.token;
        player.token_id = this.token_id;
        player.cosmetics.skin = Math.max(0, Math.min(MAX_VALUES.SKIN, this.skin));
        player.cosmetics.accessory = Math.max(0, Math.min(MAX_VALUES.ACCESSORY, this.accessory));
        player.cosmetics.bag = Math.max(0, Math.min(MAX_VALUES.BAG, this.bag));
        player.cosmetics.book = Math.max(0, Math.min(MAX_VALUES.BOOK, this.book));
        player.cosmetics.crate = Math.max(0, Math.min(MAX_VALUES.CRATE, this.crate));
        player.cosmetics.dead = Math.max(0, Math.min(MAX_VALUES.CRATE, this.dead));
        if (player.account) {
            if (this.login === this.server.settings.owner_login || this.server.settings.admins.includes(this.login)) {
                player.permission = permissions_1.Permissions.OWNER;
                player.cosmetics.skin = cosmetics_1.SKIN.ROBOT;
                player.cosmetics.crate = cosmetics_1.BOX.BOX_OF_THE_BABY_LAVA;
            }
        }
    }
    restoreResponse(player) {
        const players = this.server.alivePlayers.map(({ id, score, level, nickname, cosmetics }) => {
            return [id, nickname, level, leaderboard_utils_1.default.restoreNumber(score), cosmetics.skin, cosmetics.accessory, cosmetics.book, cosmetics.bag];
        });
        this.client.sendJSON([
            packets_1.ClientStringPackets.HANDSHAKE,
            this.server.mode,
            player.time,
            player.position.x,
            players,
            this.server.timeSystem.time,
            player.totem ? player.totem.data : [],
            player.id,
            player.position.y,
            this.server.settings.player_limit + 4,
            0,
            0,
            player.inventory.items,
            this.server.timeSystem.getGameTime(),
            Date.now() - player.createdAt,
            player.quests,
            58085,
            this.config.important.map_width,
            this.config.important.map_height,
            this.config.important.islands,
            this.config.important.custom_map.length ? this.config.important.custom_map : 0,
            this.server.welcome,
            this.server.craftSystem.crafts,
            0,
            0,
            this.server.config.important.market ? this.server.market.orders : 0
        ]);
        if (player.inventory.maxSize >= 11) {
            this.client.sendU8([packets_1.ClientPackets.GET_BAG]);
        }
        if (this.server.config.disable_clock)
            this.client.sendU8([packets_1.ClientPackets.HIDE_CLOCK]);
        if (this.server.config.disable_kit)
            this.client.sendU8([packets_1.ClientPackets.HIDE_SHOP_KIT]);
        if (this.server.config.disable_quest)
            this.client.sendU8([packets_1.ClientPackets.HIDE_QUEST]);
        if (this.server.config.disable_shop)
            this.client.sendU8([packets_1.ClientPackets.HIDE_MARKET]);
    }
    response(player) {
        const players = this.server.alivePlayers.map(({ id, level, nickname, cosmetics, score }) => {
            return [id, nickname, level, leaderboard_utils_1.default.restoreNumber(score), cosmetics.skin, cosmetics.accessory, cosmetics.book, cosmetics.bag];
        });
        // const token_id = this.token_id ? this.token_id : Utils.generateRandomString(12);
        // const tokenData = this.server.tokenSystem.getToken(player.data.token_id);
        this.client.sendJSON([
            packets_1.ClientStringPackets.HANDSHAKE,
            this.server.mode,
            player.time,
            player.position.x,
            players,
            this.server.timeSystem.time,
            player.totem ? player.totem.data : [],
            player.id,
            player.position.y,
            this.server.settings.player_limit + 4,
            0,
            0,
            player.inventory.items,
            this.server.timeSystem.getGameTime(),
            0,
            [],
            58085,
            this.config.important.map_width,
            this.config.important.map_height,
            this.config.important.islands,
            this.config.important.custom_map.length ? this.config.important.custom_map : 0,
            this.server.welcome,
            this.server.craftSystem.crafts,
            0,
            0,
            this.server.config.important.market ? this.server.market.orders : 0
        ]);
        if (this.server.config.disable_clock)
            this.client.sendU8([packets_1.ClientPackets.HIDE_CLOCK]);
        if (this.server.config.disable_kit)
            this.client.sendU8([packets_1.ClientPackets.HIDE_SHOP_KIT]);
        if (this.server.config.disable_quest)
            this.client.sendU8([packets_1.ClientPackets.HIDE_QUEST]);
        if (this.server.config.disable_shop)
            this.client.sendU8([packets_1.ClientPackets.HIDE_MARKET]);
    }
    broadcastCosmetics(player) {
        if (player.account) {
            player.level = 1 + Math.floor(Math.sqrt(player.account.seasons[0].score / 20000));
            if (player.account.kit) {
                player.inventory.increase(item_type_1.ItemType.BOOK, 1, true);
                player.inventory.increase(item_type_1.ItemType.BAG, 1, true);
            }
            this.server.broadcast(utils_1.Utils.serializeAccountToBuffer(player), true);
        }
        this.server.broadcast(utils_1.Utils.serializeCosmeticsToJSON(player), false);
        player.updateInfo();
    }
}
exports.Handshake = Handshake;
