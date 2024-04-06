import Player from "../entities/player";
import {Server} from "../server";
import {Handshake} from "../packets/handshake";
import {Crate} from "../entities/crate";
import {StateType} from "../enums/types/state.type";
import {PacketUtils} from "./packet.utils";
import {IP} from "./ip";
import {captcha} from "../packets/captcha";
import {CachedPackets} from "./cached.packets";
import {ClientPackets, ClientStringPackets, ServerPackets} from "../enums/packets";
import {ItemType} from "../enums/types/item.type";
import Master from "../master/master";
import PacketSender from "./packet.sender";

export class Client {
    public socket: any;
    public joinedAt: number;

    public ip: IP;

    private getSessions: boolean;
    public closing: boolean;
    public isActive: boolean;
    public captcha: any;
    public server: Server;
    public player!: Player;

    constructor(socket: any, server: Server, ip: IP) {
        this.isActive = true;
        this.closing = false;
        this.getSessions = false;

        this.server = server;
        this.socket = socket;
        this.ip = ip;
    }

    public get requireCaptcha() {
        return this.ip.connectionAmount === 0 || this.ip.connectionAmount % 2 === 0;
    }

    public ban(time: number) {
        this.server.logger.log("[Network] " + this.ip.address + " banned for " + time / 1000 + "s");
        PacketSender.message(this.player,"You are banned! Time left: " + time / 1000 + "s");
        this.ip.banTime = Date.now() + time;
        this.close();
    }

    public onOpen() {
        if (Date.now() < this.ip.banTime) {
            this.socket.close();
            return;
        }

        if(this.server.alivePlayers.length >= this.server.settings.player_limit - 2) {
            this.socket.close();
        }
    }

    private sendCaptcha() {
        if(this.requireCaptcha) {
            if(this.ip.attempts-- <= 0) {
                this.ip.attempts = 5;
                this.ban(15000);
                
                return;
            }

            this.captcha = captcha[Math.floor(Math.random() * captcha.length)];
            this.sendBinary(new Uint8Array([100, this.ip.attempts, ...this.captcha.buffer]));
            setTimeout(() => {
                if(!this.player) {
                    this.close();
                }
            }, 10000);
        } else this.sendBinary(CachedPackets.get(ClientPackets.CAPTCHA));
    }

    public async onMessage(buffer: ArrayBuffer, isBinary: boolean) {
        if (!isBinary) {
            this.close();
            return;
        }
        try {
            const PACKET_DATA = PacketUtils.decode(this.player, buffer);
            const PACKET_TYPE = PACKET_DATA.shift();
            const PACKET = PACKET_DATA[0];
            console.log(PACKET_TYPE, PACKET);

            if (!this.player && typeof PACKET_TYPE !== "string") {
                if(PACKET_TYPE === 38) {
                    this.sendCaptcha();
                    return;
                }

                if(PACKET_TYPE === ServerPackets.GET_SESSIONS && !this.getSessions && typeof PACKET_DATA[0] === "string" && typeof PACKET_DATA[1] === "string") {
                    const account = await Master.getAccount(this.server, PACKET_DATA[0], PACKET_DATA[1]);
                    this.getSessions = true;
                    if(account) {
                        const players = this.server.alivePlayers.filter(player =>
                            player.account?.name === account.name && player.account?.password === account.password
                        );

                        if(players.length) {
                            this.sendJSON([ClientStringPackets.SESSION_LIST,
                                ...players.map(player => [player.nickname, player.token, player.token_id, player.inventory.serialize()])]);
                        } else this.sendCaptcha();
                    } else this.sendCaptcha();
                }
            } else if (typeof PACKET_TYPE === "string") {
                const player = this.server.findPlayerByToken(PACKET_DATA[0] as any, PACKET_DATA[1] as any);

                if (
                    (PACKET_DATA.length !== 11) ||
                    (!player && this.requireCaptcha && PACKET_DATA[10] !== this.captcha?.text)
                ) {
                    this.close();
                    return;
                }

                const handshake = new Handshake([PACKET_TYPE, ...PACKET_DATA], this);

                if (player) {
                    if(player.client?.isActive) {
                        player.client.sendU8([ClientPackets.STEAL_TOKEN]);
                        player.client.socket.close();
                    }

                    player.client = this;

                    this.player = player;

                    await handshake.restoreResponse(this.player);
                } else {
                    await handshake.setupPlayer(this);

                    handshake.response(this.player);
                    handshake.broadcastCosmetics(this.player);

                    this.server.kitSystem.gainKit(this.player, "starter");
                }

                this.player.inCamera = [];

                this.ip.connectionAmount++;
                this.ip.attempts = 5;
            }

            if (!this.player) return;

            this.receivePacket(PACKET_TYPE, PACKET, PACKET_DATA);
        } catch(e) {
            this.server.logger.log(Error().stack);
        }
    }

    public receivePacket(PACKET_TYPE: number, PACKET: any, PACKET_DATA: any) {
        const now = Date.now();

        this.ip.packetsQty[PACKET_TYPE] ??= 0;
        this.ip.packetsQty[PACKET_TYPE]++;

        let delta = this.server.ticker.delta;

        if(delta > 1) delta = 1;

        if(
            this.ip.packetsQty[ServerPackets.CHAT] > 7 ||
            this.ip.packetsQty[ServerPackets.BUILD] > 8 / delta ||
            this.ip.packetsQty[PACKET_TYPE] > 38 / delta
        ) {
            this.ban(30000);
            return;
        }

        if (!Number.isInteger(PACKET_TYPE) && PACKET_TYPE > 40 || PACKET_TYPE < 0) {
            return;
        }

        if((this.player.hasState(StateType.GHOST) || this.player.hasState(StateType.CRAFT)) && [
                ServerPackets.ATTACK, ServerPackets.INTERACTION,
                ServerPackets.CRAFT, ServerPackets.RECYCLE_START,
                ServerPackets.DROP_ONE_ITEM, ServerPackets.DROP_ITEM,
                ServerPackets.GIVE_ITEM, ServerPackets.TAKE_ITEM,
                ServerPackets.LOCK_CHEST, ServerPackets.BUILD,
                ServerPackets.JOIN_TEAM
        ].includes(PACKET_TYPE)) return;

        if(this.player.flight && (
            PACKET_TYPE === ServerPackets.LOCK_CHEST || PACKET_TYPE === ServerPackets.UNLOCK_CHEST ||
            PACKET_TYPE === ServerPackets.GIVE_FURNACE || PACKET_TYPE === ServerPackets.GIVE_ITEM ||
            PACKET_TYPE === ServerPackets.GIVE_WELL || PACKET_TYPE === ServerPackets.GIVE_WOOD_EXTRACTOR ||
            PACKET_TYPE === ServerPackets.GIVE_FLOUR_OVEN || PACKET_TYPE === ServerPackets.GIVE_WOOD_OVEN ||
            PACKET_TYPE === ServerPackets.GIVE_WHEAT ||
            PACKET_TYPE === ServerPackets.JOIN_TEAM || PACKET_TYPE === ServerPackets.LOCK_TEAM ||
            PACKET_TYPE === ServerPackets.TAKE_ITEM || PACKET_TYPE === ServerPackets.TAKE_FLOUR ||
            PACKET_TYPE === ServerPackets.TAKE_EXTRACTOR || PACKET_TYPE === ServerPackets.TAKE_BREAD_OVEN
        )) return;

        switch (PACKET_TYPE) {
            case ServerPackets.CHAT:
                if(this.server.config.disable_chat === 1 || PACKET.length > 65) break;

                this.server.logger.log(`[CHAT] <${this.player.nickname}|${this.player.id}>: ${PACKET}`);
                this.server.broadcastJSON([ClientStringPackets.CHAT, this.player.id, PACKET], this.player);
                break;
            case ServerPackets.MOVEMENT:
                this.player.direction = PACKET;
                break;
            case ServerPackets.ANGLE: {
                this.player.angle = Number(PACKET) % 255;
            } break;
            case ServerPackets.ATTACK: {
                this.player.angle = Number(PACKET) % 255;
                if(!(this.player.state & StateType.ATTACK)) {
                    this.player.state += StateType.ATTACK;
                }
            } break;
            case ServerPackets.INTERACTION: {
                this.server.interactionSystem.request(this.player, PACKET);
            } break;
            case ServerPackets.DROP_ONE_ITEM:
                if (
                    this.player.inventory.contains(PACKET) &&
                    now - this.player.timestamps.get("drop") > 1000 &&
                    !(this.player.flight && PACKET === this.player.vehicle.id)
                ) {
                    this.player.timestamps.set("drop", now);
                    const crate = new Crate(this.server, {
                        type: "drop",
                        owner: this.player,
                        item: PACKET,
                        count: this.player.inventory.count(PACKET)
                    });
                    crate.id = this.server.entityPool.generate();
                    this.server.entities[crate.id] = crate;
                    this.server.logger.log(`[DROP] ${this.player.nickname}|${this.player.id} x${this.player.inventory.count(PACKET)} ${ItemType[PACKET]}`);
                    this.player.inventory.delete(PACKET, true);
                }
                break;
            case ServerPackets.CRAFT:
                this.server.craftSystem.craft(this.player, Number(PACKET));
                break;
            case ServerPackets.UNLOCK_CHEST:
                this.server.storageSystem.unlockChest(this.player);
                break;
            case ServerPackets.LOCK_CHEST:
                this.server.storageSystem.lockChest(this.player);
                break;
            case ServerPackets.GIVE_ITEM:
                this.server.storageSystem.giveChestItem(this.player, PACKET_DATA);
                break;
            case ServerPackets.TAKE_ITEM:
                this.server.storageSystem.takeChestItem(this.player);
                break;
            case ServerPackets.RECYCLE_START:
                if (this.server.config.disable_recycling === 0) {
                    this.server.craftSystem.recycle(this.player, Number(PACKET));
                }
                break;
            case ServerPackets.RESURRECTION:
                if(this.player.hasState(StateType.RESURRECTION) && this.player.hasState(StateType.GHOST)) {
                    this.player.removeState(StateType.GHOST);
                    this.sendU8([ClientPackets.REBORN]);
                    this.player.updateInfo();
                }
                break;
            case ServerPackets.BUILD:
                this.server.buildingSystem.request(this.player, PACKET_DATA);
                break;
            case ServerPackets.STOP_ATTACK:
                this.player.removeState(StateType.ATTACK);
                break;
            case ServerPackets.CHOOSE_KIT:
                // this.server.kitSystem.buy(this.player, PACKET);
                break;
            case ServerPackets.CLAIM_QUEST_REWARD:
                // this.server.questSystem.gainQuest(this.player, PACKET);
                break;
            case ServerPackets.DROP_ITEM:
                if (
                    this.player.inventory.contains(PACKET) &&
                    now - this.player.timestamps.get("drop") > 1000 &&
                    !(this.player.flight && PACKET === this.player.vehicle.id)
                ) {
                    this.player.timestamps.set("drop", now);
                    const crate = new Crate(this.server, {
                        type: "drop",
                        owner: this.player,
                        item: PACKET,
                        count: 1
                    });
                    crate.id = this.server.entityPool.generate();
                    this.server.entities[crate.id] = crate;
                    this.server.logger.log(`[DROP] ${this.player.nickname}|${this.player.id} x1 ${ItemType[PACKET]}`);
                    this.player.inventory.decrease(PACKET, 1, true);
                }
                break;
            case ServerPackets.CANCEL_CRAFT:
                this.server.craftSystem.stop(this.player);
                break;
            case ServerPackets.JOIN_TEAM:
                this.server.teamSystem.joinTeam(this.player);
                break;
            case ServerPackets.LEAVE_TEAM:
                this.server.teamSystem.leaveTeam(this.player);
                break;
            case ServerPackets.KICK_TEAM:
                this.server.teamSystem.kickTeam(this.player, PACKET);
                break;
            case ServerPackets.LOCK_TEAM:
                this.server.teamSystem.lockTeam(this.player);
                break;
            case ServerPackets.MARKET:
                if(this.server.config.disable_shop) break;

                this.server.market.buy(this.player, PACKET_DATA);
                break;
            case ServerPackets.CONSOLE:
                this.server.commandSystem.handleCommand(this.player, PACKET);
                break;
            case ServerPackets.GIVE_WELL:
                // this.server.storageSystem.giveWell(this.player);
                break;
            case ServerPackets.TAKE_BREAD_OVEN:
                // this.server.storageSystem.takeBread(this.player);
                break;
            case ServerPackets.GIVE_FLOUR_OVEN:
                // this.server.storageSystem.giveFlourOven(this.player, PACKET);
                break;
            case ServerPackets.GIVE_WOOD_OVEN:
                // this.server.storageSystem.giveWoodOven(this.player, PACKET);
                break;
            case ServerPackets.GIVE_FURNACE:
                // this.server.storageSystem.giveFurnace(this.player, PACKET);
                break;
            case ServerPackets.TAKE_FLOUR:
                // this.server.storageSystem.takeFlour(this.player);
                break;
            case ServerPackets.GIVE_WHEAT:
                // this.server.storageSystem.giveWheat(this.player, PACKET);
                break;
            case ServerPackets.TAKE_EXTRACTOR:
                // this.server.storageSystem.takeResourceExtractor(this.player);
                break;
            case ServerPackets.GIVE_WOOD_EXTRACTOR:
                // this.server.storageSystem.giveWoodExtractor(this.player, PACKET);
                break;
        }
    }

    public onClose() {
        this.isActive = false;
    }

    public close() {
        this.closing = true;
    }

    public sendJSON(message: any) {
        if (this.isActive && message) this.socket.send(JSON.stringify(message));
    }

    public sendU8(message: any){
        if (this.isActive && message) this.socket.send(new Uint8Array(message), true);
    }

    public sendU16(message: any){
        if (this.isActive && message) this.socket.send(new Uint16Array(message), true);
    }

    public sendU32(message: any){
        if (this.isActive && message) this.socket.send(new Uint32Array(message), true);
    }

    public sendBinary(message: Uint8Array | Uint16Array | Uint32Array | undefined) {
        if (this.isActive && message) this.socket.send(message, true);
    }
}
