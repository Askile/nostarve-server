"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
const handshake_1 = require("../packets/handshake");
const crate_1 = require("../entities/crate");
const state_type_1 = require("../enums/types/state.type");
const packet_utils_1 = require("./packet.utils");
const captcha_1 = require("../packets/captcha");
const cached_packets_1 = require("./cached.packets");
const packets_1 = require("../enums/packets");
const item_type_1 = require("../enums/types/item.type");
const master_1 = __importDefault(require("../master/master"));
const packet_sender_1 = __importDefault(require("./packet.sender"));
class Client {
    socket;
    joinedAt;
    ip;
    getSessions;
    closing;
    isActive;
    captcha;
    server;
    player;
    constructor(socket, server, ip) {
        this.isActive = true;
        this.closing = false;
        this.getSessions = false;
        this.server = server;
        this.socket = socket;
        this.ip = ip;
    }
    get requireCaptcha() {
        return this.ip.connectionAmount === 0 || this.ip.connectionAmount % 2 === 0;
    }
    ban(time) {
        this.server.logger.log("[Network] " + this.ip.address + " banned for " + time / 1000 + "s");
        packet_sender_1.default.message(this.player, "You are banned! Time left: " + time / 1000 + "s");
        this.ip.banTime = Date.now() + time;
        this.close();
    }
    onOpen() {
        if (Date.now() < this.ip.banTime) {
            this.socket.close();
            return;
        }
        if (this.server.alivePlayers.length >= this.server.settings.player_limit - 2) {
            this.socket.close();
        }
    }
    sendCaptcha() {
        if (this.requireCaptcha) {
            if (this.ip.attempts-- <= 0) {
                this.ip.attempts = 5;
                this.ban(15000);
                return;
            }
            this.captcha = captcha_1.captcha[Math.floor(Math.random() * captcha_1.captcha.length)];
            this.sendBinary(new Uint8Array([100, this.ip.attempts, ...this.captcha.buffer]));
            setTimeout(() => {
                if (!this.player) {
                    this.close();
                }
            }, 10000);
        }
        else
            this.sendBinary(cached_packets_1.CachedPackets.get(packets_1.ClientPackets.CAPTCHA));
    }
    async onMessage(buffer, isBinary) {
        if (!isBinary) {
            this.close();
            return;
        }
        try {
            const PACKET_DATA = packet_utils_1.PacketUtils.decode(this.player, buffer);
            const PACKET_TYPE = PACKET_DATA.shift();
            const PACKET = PACKET_DATA[0];
            console.log(PACKET_TYPE, PACKET);
            if (!this.player && typeof PACKET_TYPE !== "string") {
                if (PACKET_TYPE === 38) {
                    this.sendCaptcha();
                    return;
                }
                if (PACKET_TYPE === packets_1.ServerPackets.GET_SESSIONS && !this.getSessions && typeof PACKET_DATA[0] === "string" && typeof PACKET_DATA[1] === "string") {
                    const account = await master_1.default.getAccount(this.server, PACKET_DATA[0], PACKET_DATA[1]);
                    this.getSessions = true;
                    if (account) {
                        const players = this.server.alivePlayers.filter(player => player.account?.name === account.name && player.account?.password === account.password);
                        if (players.length) {
                            this.sendJSON([packets_1.ClientStringPackets.SESSION_LIST,
                                ...players.map(player => [player.nickname, player.token, player.token_id, player.inventory.serialize()])]);
                        }
                        else
                            this.sendCaptcha();
                    }
                    else
                        this.sendCaptcha();
                }
            }
            else if (typeof PACKET_TYPE === "string") {
                const player = this.server.findPlayerByToken(PACKET_DATA[0], PACKET_DATA[1]);
                if ((PACKET_DATA.length !== 11) ||
                    (!player && this.requireCaptcha && PACKET_DATA[10] !== this.captcha?.text)) {
                    this.close();
                    return;
                }
                const handshake = new handshake_1.Handshake([PACKET_TYPE, ...PACKET_DATA], this);
                if (player) {
                    if (player.client?.isActive) {
                        player.client.sendU8([packets_1.ClientPackets.STEAL_TOKEN]);
                        player.client.socket.close();
                    }
                    player.client = this;
                    this.player = player;
                    await handshake.restoreResponse(this.player);
                }
                else {
                    await handshake.setupPlayer(this);
                    handshake.response(this.player);
                    handshake.broadcastCosmetics(this.player);
                    this.server.kitSystem.gainKit(this.player, "starter");
                }
                this.player.inCamera = [];
                this.ip.connectionAmount++;
                this.ip.attempts = 5;
            }
            if (!this.player)
                return;
            this.receivePacket(PACKET_TYPE, PACKET, PACKET_DATA);
        }
        catch (e) {
            this.server.logger.log(Error().stack);
        }
    }
    receivePacket(PACKET_TYPE, PACKET, PACKET_DATA) {
        const now = Date.now();
        this.ip.packetsQty[PACKET_TYPE] ??= 0;
        this.ip.packetsQty[PACKET_TYPE]++;
        let delta = this.server.ticker.delta;
        if (delta > 1)
            delta = 1;
        if (this.ip.packetsQty[packets_1.ServerPackets.CHAT] > 7 ||
            this.ip.packetsQty[packets_1.ServerPackets.BUILD] > 8 / delta ||
            this.ip.packetsQty[PACKET_TYPE] > 38 / delta) {
            this.ban(30000);
            return;
        }
        if (!Number.isInteger(PACKET_TYPE) && PACKET_TYPE > 40 || PACKET_TYPE < 0) {
            return;
        }
        if ((this.player.hasState(state_type_1.StateType.GHOST) || this.player.hasState(state_type_1.StateType.CRAFT)) && [
            packets_1.ServerPackets.ATTACK, packets_1.ServerPackets.INTERACTION,
            packets_1.ServerPackets.CRAFT, packets_1.ServerPackets.RECYCLE_START,
            packets_1.ServerPackets.DROP_ONE_ITEM, packets_1.ServerPackets.DROP_ITEM,
            packets_1.ServerPackets.GIVE_ITEM, packets_1.ServerPackets.TAKE_ITEM,
            packets_1.ServerPackets.LOCK_CHEST, packets_1.ServerPackets.BUILD,
            packets_1.ServerPackets.JOIN_TEAM
        ].includes(PACKET_TYPE))
            return;
        if (this.player.flight && (PACKET_TYPE === packets_1.ServerPackets.LOCK_CHEST || PACKET_TYPE === packets_1.ServerPackets.UNLOCK_CHEST ||
            PACKET_TYPE === packets_1.ServerPackets.GIVE_FURNACE || PACKET_TYPE === packets_1.ServerPackets.GIVE_ITEM ||
            PACKET_TYPE === packets_1.ServerPackets.GIVE_WELL || PACKET_TYPE === packets_1.ServerPackets.GIVE_WOOD_EXTRACTOR ||
            PACKET_TYPE === packets_1.ServerPackets.GIVE_FLOUR_OVEN || PACKET_TYPE === packets_1.ServerPackets.GIVE_WOOD_OVEN ||
            PACKET_TYPE === packets_1.ServerPackets.GIVE_WHEAT ||
            PACKET_TYPE === packets_1.ServerPackets.JOIN_TEAM || PACKET_TYPE === packets_1.ServerPackets.LOCK_TEAM ||
            PACKET_TYPE === packets_1.ServerPackets.TAKE_ITEM || PACKET_TYPE === packets_1.ServerPackets.TAKE_FLOUR ||
            PACKET_TYPE === packets_1.ServerPackets.TAKE_EXTRACTOR || PACKET_TYPE === packets_1.ServerPackets.TAKE_BREAD_OVEN))
            return;
        switch (PACKET_TYPE) {
            case packets_1.ServerPackets.CHAT:
                if (this.server.config.disable_chat === 1 || PACKET.length > 65)
                    break;
                this.server.logger.log(`[CHAT] <${this.player.nickname}|${this.player.id}>: ${PACKET}`);
                this.server.broadcastJSON([packets_1.ClientStringPackets.CHAT, this.player.id, PACKET], this.player);
                break;
            case packets_1.ServerPackets.MOVEMENT:
                this.player.direction = PACKET;
                break;
            case packets_1.ServerPackets.ANGLE:
                {
                    this.player.angle = Number(PACKET) % 255;
                }
                break;
            case packets_1.ServerPackets.ATTACK:
                {
                    this.player.angle = Number(PACKET) % 255;
                    if (!(this.player.state & state_type_1.StateType.ATTACK)) {
                        this.player.state += state_type_1.StateType.ATTACK;
                    }
                }
                break;
            case packets_1.ServerPackets.INTERACTION:
                {
                    this.server.interactionSystem.request(this.player, PACKET);
                }
                break;
            case packets_1.ServerPackets.DROP_ONE_ITEM:
                if (this.player.inventory.contains(PACKET) &&
                    now - this.player.timestamps.get("drop") > 1000 &&
                    !(this.player.flight && PACKET === this.player.vehicle.id)) {
                    this.player.timestamps.set("drop", now);
                    const crate = new crate_1.Crate(this.server, {
                        type: "drop",
                        owner: this.player,
                        item: PACKET,
                        count: this.player.inventory.count(PACKET)
                    });
                    crate.id = this.server.entityPool.generate();
                    this.server.entities[crate.id] = crate;
                    this.server.logger.log(`[DROP] ${this.player.nickname}|${this.player.id} x${this.player.inventory.count(PACKET)} ${item_type_1.ItemType[PACKET]}`);
                    this.player.inventory.delete(PACKET, true);
                }
                break;
            case packets_1.ServerPackets.CRAFT:
                this.server.craftSystem.craft(this.player, Number(PACKET));
                break;
            case packets_1.ServerPackets.UNLOCK_CHEST:
                this.server.storageSystem.unlockChest(this.player);
                break;
            case packets_1.ServerPackets.LOCK_CHEST:
                this.server.storageSystem.lockChest(this.player);
                break;
            case packets_1.ServerPackets.GIVE_ITEM:
                this.server.storageSystem.giveChestItem(this.player, PACKET_DATA);
                break;
            case packets_1.ServerPackets.TAKE_ITEM:
                this.server.storageSystem.takeChestItem(this.player);
                break;
            case packets_1.ServerPackets.RECYCLE_START:
                if (this.server.config.disable_recycling === 0) {
                    this.server.craftSystem.recycle(this.player, Number(PACKET));
                }
                break;
            case packets_1.ServerPackets.RESURRECTION:
                if (this.player.hasState(state_type_1.StateType.RESURRECTION) && this.player.hasState(state_type_1.StateType.GHOST)) {
                    this.player.removeState(state_type_1.StateType.GHOST);
                    this.sendU8([packets_1.ClientPackets.REBORN]);
                    this.player.updateInfo();
                }
                break;
            case packets_1.ServerPackets.BUILD:
                this.server.buildingSystem.request(this.player, PACKET_DATA);
                break;
            case packets_1.ServerPackets.STOP_ATTACK:
                this.player.removeState(state_type_1.StateType.ATTACK);
                break;
            case packets_1.ServerPackets.CHOOSE_KIT:
                // this.server.kitSystem.buy(this.player, PACKET);
                break;
            case packets_1.ServerPackets.CLAIM_QUEST_REWARD:
                // this.server.questSystem.gainQuest(this.player, PACKET);
                break;
            case packets_1.ServerPackets.DROP_ITEM:
                if (this.player.inventory.contains(PACKET) &&
                    now - this.player.timestamps.get("drop") > 1000 &&
                    !(this.player.flight && PACKET === this.player.vehicle.id)) {
                    this.player.timestamps.set("drop", now);
                    const crate = new crate_1.Crate(this.server, {
                        type: "drop",
                        owner: this.player,
                        item: PACKET,
                        count: 1
                    });
                    crate.id = this.server.entityPool.generate();
                    this.server.entities[crate.id] = crate;
                    this.server.logger.log(`[DROP] ${this.player.nickname}|${this.player.id} x1 ${item_type_1.ItemType[PACKET]}`);
                    this.player.inventory.decrease(PACKET, 1, true);
                }
                break;
            case packets_1.ServerPackets.CANCEL_CRAFT:
                this.server.craftSystem.stop(this.player);
                break;
            case packets_1.ServerPackets.JOIN_TEAM:
                this.server.teamSystem.joinTeam(this.player);
                break;
            case packets_1.ServerPackets.LEAVE_TEAM:
                this.server.teamSystem.leaveTeam(this.player);
                break;
            case packets_1.ServerPackets.KICK_TEAM:
                this.server.teamSystem.kickTeam(this.player, PACKET);
                break;
            case packets_1.ServerPackets.LOCK_TEAM:
                this.server.teamSystem.lockTeam(this.player);
                break;
            case packets_1.ServerPackets.MARKET:
                if (this.server.config.disable_shop)
                    break;
                this.server.market.buy(this.player, PACKET_DATA);
                break;
            case packets_1.ServerPackets.CONSOLE:
                this.server.commandSystem.handleCommand(this.player, PACKET);
                break;
            case packets_1.ServerPackets.GIVE_WELL:
                // this.server.storageSystem.giveWell(this.player);
                break;
            case packets_1.ServerPackets.TAKE_BREAD_OVEN:
                // this.server.storageSystem.takeBread(this.player);
                break;
            case packets_1.ServerPackets.GIVE_FLOUR_OVEN:
                // this.server.storageSystem.giveFlourOven(this.player, PACKET);
                break;
            case packets_1.ServerPackets.GIVE_WOOD_OVEN:
                // this.server.storageSystem.giveWoodOven(this.player, PACKET);
                break;
            case packets_1.ServerPackets.GIVE_FURNACE:
                // this.server.storageSystem.giveFurnace(this.player, PACKET);
                break;
            case packets_1.ServerPackets.TAKE_FLOUR:
                // this.server.storageSystem.takeFlour(this.player);
                break;
            case packets_1.ServerPackets.GIVE_WHEAT:
                // this.server.storageSystem.giveWheat(this.player, PACKET);
                break;
            case packets_1.ServerPackets.TAKE_EXTRACTOR:
                // this.server.storageSystem.takeResourceExtractor(this.player);
                break;
            case packets_1.ServerPackets.GIVE_WOOD_EXTRACTOR:
                // this.server.storageSystem.giveWoodExtractor(this.player, PACKET);
                break;
        }
    }
    onClose() {
        this.isActive = false;
    }
    close() {
        this.closing = true;
    }
    sendJSON(message) {
        if (this.isActive && message)
            this.socket.send(JSON.stringify(message));
    }
    sendU8(message) {
        if (this.isActive && message)
            this.socket.send(new Uint8Array(message), true);
    }
    sendU16(message) {
        if (this.isActive && message)
            this.socket.send(new Uint16Array(message), true);
    }
    sendU32(message) {
        if (this.isActive && message)
            this.socket.send(new Uint32Array(message), true);
    }
    sendBinary(message) {
        if (this.isActive && message)
            this.socket.send(message, true);
    }
}
exports.Client = Client;
