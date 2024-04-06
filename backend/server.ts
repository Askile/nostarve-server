import Player from "./entities/player";
import {Entity} from "./entities/entity";
import {IdPool} from "./modules/id.pool";
import {WebSocketServer} from "./network/websocket.server";
import {Ticker} from "./world/ticker";
import {World} from "./world/world";
import {Leaderboard} from "./leaderboard/leaderboard";
import {TimeSystem} from "./systems/time.system";
import {KitSystem} from "./systems/kit.system";
import {EventSystem} from "./systems/event.system";
import {BuildingSystem} from "./building/building.system";
import CombatSystem from "./combat/combat.system";
import {ConfigSystem} from "./systems/config.system";
import {InteractionSystem} from "./systems/interaction.system";
import {StorageSystem} from "./systems/storage.system";
import {QuestSystem} from "./systems/quest.system";
import {BinaryWriter} from "./modules/binary.writer";
import {Vector} from "./modules/vector";
import {ActionType} from "./enums/types/action.type";
import {SaveSystem} from "./systems/save.system";
import {Client} from "./network/client";
import {IP} from "./network/ip";
import {Crate} from "./entities/crate";
import {ClientPackets} from "./enums/packets";
import {GameMode} from "./enums/game.mode";
import {Spawner} from "./world/spawner";
import {StateType} from "./enums/types/state.type";
import Logger from "./modules/logger";
import {ContentManager} from "./content/content.manager";
import {Content} from "./content/content";
import {EntityType} from "./enums/types/entity.type";
import fs from "fs";
import Market from "./items/market";
import AnimalSpawner from "./animal/animal.spawner";
import DiscordBot from "./discord/bot";
import CraftSystem from "./craft/craft.system";
import CommandSystem from "./command/command.system";
import TeamSystem from "./team/team.system";

Math.clamp = (variable: number, min: number, max: number) => {
    return Math.max(min, Math.min(variable, max));
}

Math.randomClamp = (min: number, max: number) => {
    return Math.floor(min + Math.random() * (max + 1 - min));
}

Math.PI2 = Math.PI * 2;

const config = JSON.parse(fs.readFileSync("./JSON/config.json", "utf-8"));
export const discordConfig = JSON.parse(fs.readFileSync("./JSON/discord.json", "utf-8"));
const serverConfig = JSON.parse(fs.readFileSync("./JSON/server.settings.json", "utf-8"));
export const objects = JSON.parse(fs.readFileSync("./JSON/resources.json", "utf-8")).objects;
export class Server {
    public players: Player[];
    public alivePlayers: Player[];
    public entities: Entity[];
    public playerPool: IdPool;
    public entityPool: IdPool;
    public wss: WebSocketServer;
    public config: Config;
    public settings: Settings;

    public welcome: string;
    public url: string;
    public mode: number;
    public port: number;
    public loaded: boolean;
    public timestamp: number;

    public world: World;
    public leaderboard: Leaderboard;
    public discord: DiscordBot;
    public spawner: Spawner;
    public animalSpawner: AnimalSpawner;

    public content: Content;
    public contentManager: ContentManager;
    public saveSystem: SaveSystem;
    public craftSystem: CraftSystem;
    public teamSystem: TeamSystem;
    public timeSystem: TimeSystem;
    public kitSystem: KitSystem;
    public eventSystem: EventSystem;
    public storageSystem: StorageSystem;
    public commandSystem: CommandSystem;
    public combatSystem: CombatSystem;
    public configSystem: ConfigSystem;
    public questSystem: QuestSystem;
    public market: Market;
    public buildingSystem: BuildingSystem;
    public interactionSystem: InteractionSystem;
    public logger: Logger = new Logger({
        title: "Arena of bottle",
        delay: 50,
        outputFile: "./data/logs/"
    });

    public ticker: Ticker;

    constructor() {
        this.config = config as any;
        this.loaded = false;
        this.settings = serverConfig as any;
        this.configSystem = new ConfigSystem(this);

        this.timestamp = Date.now();
        this.playerPool = new IdPool(0);
        this.entityPool = new IdPool(this.settings.player_limit + 2);

        this.entities = [];
        this.alivePlayers = [];
        this.players = [];

        this.welcome = "";
        this.url = `http${this.settings.production ? "s" : ""}://${this.settings.production ? this.settings.domain : "localhost"}/`;
        this.mode = GameMode[this.settings.mode as any] as any ?? GameMode.normal;
        this.port = this.settings.production ? 80 : 443;

        this.world = new World(this);
        this.wss = new WebSocketServer(this);
        this.spawner = new Spawner(this);
        this.animalSpawner = new AnimalSpawner(this);
        this.discord = new DiscordBot(this);

        this.content = new Content(this);
        this.contentManager = new ContentManager(this);
        this.saveSystem = new SaveSystem(this);
        this.leaderboard = new Leaderboard(this);
        this.timeSystem = new TimeSystem(this);
        this.craftSystem = new CraftSystem(this);
        this.kitSystem = new KitSystem(this.config);
        this.eventSystem = new EventSystem(this);
        this.combatSystem = new CombatSystem(this);
        this.interactionSystem = new InteractionSystem(this);
        this.storageSystem = new StorageSystem(this);
        this.commandSystem = new CommandSystem(this);
        this.questSystem = new QuestSystem();
        this.market = new Market(this);
        this.teamSystem = new TeamSystem(this);
        this.buildingSystem = new BuildingSystem(this);
        this.ticker = new Ticker(this);

        this.world.initCollision();
        for (let i = 0; i < this.settings.player_limit; i++) {
            const player = new Player(this);
            player.id = i + 1;
            player.client = new Client(null, this, new IP(""));
            player.client.isActive = false;

            this.players[i] = player;
        }

        this.saveSystem.load();
    }


    public broadcast(message: any, isBinary: boolean = false, self?: Player) {
        if (!message) return;
        for (const player of this.alivePlayers) {
            if (!player.client?.isActive|| player === self) continue;
                player.client.socket.send(message, isBinary);
        }
    }

    public broadcastJSON(message: any, self?: Player) {
        if (!message) return;
        this.broadcast(JSON.stringify(message), false, self);
    }

    public broadcastBinary(message: any, self?: Player) {
        if (!message) return;
        this.broadcast(message, true, self);
    }

    public shareUnits() {
        const now = Date.now();
        for (const client of this.wss.clients.values()) {
            const player = client.player;

            if(now - this.timestamp >= 1000) {
                client.ip.jps = 0;
            }

            if(now - client.joinedAt >= 10000 && !client.player) {
                if(client.isActive) {
                    client.socket.close();
                }
                continue;
            }

            if(!player) continue;

            const packet = new BinaryWriter();
            packet.writeUInt8(ClientPackets.UNITS);
            for (const entity of this.entities) {
                if(!entity) continue;
                let {pid, extra, info} = entity;
                let isInsideCamera = player.realPosition.isVectorInsideRectangle(
                    entity.realPosition,
                    player.camera.width,
                    player.camera.height
                );

                if(
                    (entity.type === EntityType.PLAYER && isInsideCamera && ((
                            entity !== player && entity.hasState(StateType.INVISIBLE)
                        ) || (
                            entity.hasState(StateType.IN_ROOF) && entity.realPosition.distance(player.realPosition) > 600
                        ))
                    ) || (entity.hasAction(ActionType.DELETE) && isInsideCamera) ||
                    (player.inCamera[entity.id] && !isInsideCamera)
                ) {
                    packet.writeUInt8(entity.type ? pid : entity.id);
                    packet.writeUInt8(entity.angle);
                    packet.writeUInt8(entity.type);
                    packet.writeUInt16(ActionType.DELETE);
                    packet.writeUInt16(entity.type ? entity.id : 0);
                    packet.writeUInt16(entity.position.x);
                    packet.writeUInt16(entity.position.y);
                    packet.writeUInt16(info);
                    packet.writeUInt16(entity.speed * 1000);
                    packet.writeUInt16(extra);
                    player.inCamera[entity.id] = false;
                    continue;
                }

                if((player.inCamera[entity.id] && !isInsideCamera)) {
                    player.inCamera[entity.id] = false;
                    continue;
                }

                if(!entity.isUpdated() && player.inCamera[entity.id] && isInsideCamera) continue;

                if(isInsideCamera) {
                    player.inCamera[entity.id] = true;

                    packet.writeUInt8(entity.type ? pid : entity.id);
                    packet.writeUInt8(entity.angle);
                    packet.writeUInt8(entity.type);
                    packet.writeUInt16(entity.action);
                    packet.writeUInt16(entity.type ? entity.id : 0);
                    packet.writeUInt16(entity.position.x);
                    packet.writeUInt16(entity.position.y);
                    packet.writeUInt16(info);
                    packet.writeUInt16(entity.speed * 1000);
                    packet.writeUInt16(extra);
                }
            }

            if(packet.getLength() > 3) {
                client.sendBinary(packet.toBuffer());
            }
        }

        if(now - this.timestamp >= 1000) {
            this.timestamp = now;
        }

        for (const entity of Object.values(this.entities)) {
            if(!entity) continue;

            entity.action &= ~ActionType.WEB;
            entity.action &= ~ActionType.HEAL;
            entity.action &= ~ActionType.ATTACK;
            entity.action &= ~ActionType.HUNGER;
            entity.action &= ~ActionType.COLD;
            entity.action &= ~ActionType.HURT;

            // entity.oldType = entity.type;
            entity.oldPosition.set(entity.position);
            entity.oldAngle = entity.angle;
            entity.oldAction = entity.action;
            entity.oldSpeed = entity.speed;
            entity.oldInfo = entity.info;
            entity.oldExtra = entity.extra;

            if(entity.action === ActionType.DELETE) {
                if(entity instanceof Player) {
                    const crate = new Crate(this, {
                        owner: entity,
                        type: "dead"
                    });

                    crate.id = this.entityPool.generate();
                    this.entities[crate.id] = crate;

                    this.playerPool.free(entity.id);
                    this.broadcast(new Uint8Array([ClientPackets.KILL_PLAYER, entity.id]), true, entity.client.socket);

                    entity.reset();
                    this.entities[entity.id] = undefined;
                } else {
                    this.entityPool.free(entity.id);
                    this.entities[entity.id] = undefined;
                }
            }
        }
    }

    public findPlayerByToken(token: string, token_id: string) {
        return this.alivePlayers.find(player => player.token === token && player.token_id === token_id);
    }

    public restart() {
        this.configSystem = new ConfigSystem(this);

        for (const client of this.wss.clients.values()) {
            client.socket.close();
        }

        this.wss.app.close();
        this.wss = new WebSocketServer(this);
        this.world = new World(this);

        this.kitSystem = new KitSystem(this.config);
        this.eventSystem = new EventSystem(this);
    }
}

let server = new Server();

process.on("uncaughtException", (err) => {
    console.log("uncaughtException", err);
    // process.exit(1);
});

process.on("unhandledRejection", (err) => {
    console.log("unhandledRejection", err);

    // process.exit(1);
});

process.on("uncaughtExceptionMonitor", (err) => {
    console.log("uncaughtExceptionMonitor", err);
    // process.exit(1);
});

process.on("SIGINT", () => {
    process.exit(0);
});

process.on("exit", async() => {
    await server.saveSystem.save();
});

