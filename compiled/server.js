"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = exports.objects = exports.discordConfig = void 0;
const player_1 = __importDefault(require("./entities/player"));
const id_pool_1 = require("./modules/id.pool");
const websocket_server_1 = require("./network/websocket.server");
const ticker_1 = require("./world/ticker");
const world_1 = require("./world/world");
const leaderboard_1 = require("./leaderboard/leaderboard");
const time_system_1 = require("./systems/time.system");
const kit_system_1 = require("./systems/kit.system");
const event_system_1 = require("./systems/event.system");
const building_system_1 = require("./building/building.system");
const combat_system_1 = __importDefault(require("./combat/combat.system"));
const config_system_1 = require("./systems/config.system");
const interaction_system_1 = require("./systems/interaction.system");
const storage_system_1 = require("./systems/storage.system");
const quest_system_1 = require("./systems/quest.system");
const binary_writer_1 = require("./modules/binary.writer");
const action_type_1 = require("./enums/types/action.type");
const save_system_1 = require("./systems/save.system");
const client_1 = require("./network/client");
const ip_1 = require("./network/ip");
const crate_1 = require("./entities/crate");
const packets_1 = require("./enums/packets");
const game_mode_1 = require("./enums/game.mode");
const spawner_1 = require("./world/spawner");
const state_type_1 = require("./enums/types/state.type");
const logger_1 = __importDefault(require("./modules/logger"));
const content_manager_1 = require("./content/content.manager");
const content_1 = require("./content/content");
const entity_type_1 = require("./enums/types/entity.type");
const fs_1 = __importDefault(require("fs"));
const market_1 = __importDefault(require("./items/market"));
const animal_spawner_1 = __importDefault(require("./animal/animal.spawner"));
const bot_1 = __importDefault(require("./discord/bot"));
const craft_system_1 = __importDefault(require("./craft/craft.system"));
const command_system_1 = __importDefault(require("./command/command.system"));
const team_system_1 = __importDefault(require("./team/team.system"));
Math.clamp = (variable, min, max) => {
    return Math.max(min, Math.min(variable, max));
};
Math.randomClamp = (min, max) => {
    return Math.floor(min + Math.random() * (max + 1 - min));
};
Math.PI2 = Math.PI * 2;
const config = JSON.parse(fs_1.default.readFileSync("./JSON/config.json", "utf-8"));
exports.discordConfig = JSON.parse(fs_1.default.readFileSync("./JSON/discord.json", "utf-8"));
const serverConfig = JSON.parse(fs_1.default.readFileSync("./JSON/server.settings.json", "utf-8"));
exports.objects = JSON.parse(fs_1.default.readFileSync("./JSON/resources.json", "utf-8")).objects;
class Server {
    players;
    alivePlayers;
    entities;
    playerPool;
    entityPool;
    wss;
    config;
    settings;
    welcome;
    url;
    mode;
    port;
    loaded;
    timestamp;
    world;
    leaderboard;
    discord;
    spawner;
    animalSpawner;
    content;
    contentManager;
    saveSystem;
    craftSystem;
    teamSystem;
    timeSystem;
    kitSystem;
    eventSystem;
    storageSystem;
    commandSystem;
    combatSystem;
    configSystem;
    questSystem;
    market;
    buildingSystem;
    interactionSystem;
    logger = new logger_1.default({
        title: "Arena of bottle",
        delay: 50,
        outputFile: "./data/logs/"
    });
    ticker;
    constructor() {
        this.config = config;
        this.loaded = false;
        this.settings = serverConfig;
        this.configSystem = new config_system_1.ConfigSystem(this);
        this.timestamp = Date.now();
        this.playerPool = new id_pool_1.IdPool(0);
        this.entityPool = new id_pool_1.IdPool(this.settings.player_limit + 2);
        this.entities = [];
        this.alivePlayers = [];
        this.players = [];
        this.welcome = "";
        this.url = `http${this.settings.production ? "s" : ""}://${this.settings.production ? this.settings.domain : "localhost"}/`;
        this.mode = game_mode_1.GameMode[this.settings.mode] ?? game_mode_1.GameMode.normal;
        this.port = this.settings.production ? 80 : 443;
        this.world = new world_1.World(this);
        this.wss = new websocket_server_1.WebSocketServer(this);
        this.spawner = new spawner_1.Spawner(this);
        this.animalSpawner = new animal_spawner_1.default(this);
        this.discord = new bot_1.default(this);
        this.content = new content_1.Content(this);
        this.contentManager = new content_manager_1.ContentManager(this);
        this.saveSystem = new save_system_1.SaveSystem(this);
        this.leaderboard = new leaderboard_1.Leaderboard(this);
        this.timeSystem = new time_system_1.TimeSystem(this);
        this.craftSystem = new craft_system_1.default(this);
        this.kitSystem = new kit_system_1.KitSystem(this.config);
        this.eventSystem = new event_system_1.EventSystem(this);
        this.combatSystem = new combat_system_1.default(this);
        this.interactionSystem = new interaction_system_1.InteractionSystem(this);
        this.storageSystem = new storage_system_1.StorageSystem(this);
        this.commandSystem = new command_system_1.default(this);
        this.questSystem = new quest_system_1.QuestSystem();
        this.market = new market_1.default(this);
        this.teamSystem = new team_system_1.default(this);
        this.buildingSystem = new building_system_1.BuildingSystem(this);
        this.ticker = new ticker_1.Ticker(this);
        this.world.initCollision();
        for (let i = 0; i < this.settings.player_limit; i++) {
            const player = new player_1.default(this);
            player.id = i + 1;
            player.client = new client_1.Client(null, this, new ip_1.IP(""));
            player.client.isActive = false;
            this.players[i] = player;
        }
        this.saveSystem.load();
    }
    broadcast(message, isBinary = false, self) {
        if (!message)
            return;
        for (const player of this.alivePlayers) {
            if (!player.client?.isActive || player === self)
                continue;
            player.client.socket.send(message, isBinary);
        }
    }
    broadcastJSON(message, self) {
        if (!message)
            return;
        this.broadcast(JSON.stringify(message), false, self);
    }
    broadcastBinary(message, self) {
        if (!message)
            return;
        this.broadcast(message, true, self);
    }
    shareUnits() {
        const now = Date.now();
        for (const client of this.wss.clients.values()) {
            const player = client.player;
            if (now - this.timestamp >= 1000) {
                client.ip.jps = 0;
            }
            if (now - client.joinedAt >= 10000 && !client.player) {
                if (client.isActive) {
                    client.socket.close();
                }
                continue;
            }
            if (!player)
                continue;
            const packet = new binary_writer_1.BinaryWriter();
            packet.writeUInt8(packets_1.ClientPackets.UNITS);
            for (const entity of this.entities) {
                if (!entity)
                    continue;
                let { pid, extra, info } = entity;
                let isInsideCamera = player.realPosition.isVectorInsideRectangle(entity.realPosition, player.camera.width, player.camera.height);
                if ((entity.type === entity_type_1.EntityType.PLAYER && isInsideCamera && ((entity !== player && entity.hasState(state_type_1.StateType.INVISIBLE)) || (entity.hasState(state_type_1.StateType.IN_ROOF) && entity.realPosition.distance(player.realPosition) > 600))) || (entity.hasAction(action_type_1.ActionType.DELETE) && isInsideCamera) ||
                    (player.inCamera[entity.id] && !isInsideCamera)) {
                    packet.writeUInt8(entity.type ? pid : entity.id);
                    packet.writeUInt8(entity.angle);
                    packet.writeUInt8(entity.type);
                    packet.writeUInt16(action_type_1.ActionType.DELETE);
                    packet.writeUInt16(entity.type ? entity.id : 0);
                    packet.writeUInt16(entity.position.x);
                    packet.writeUInt16(entity.position.y);
                    packet.writeUInt16(info);
                    packet.writeUInt16(entity.speed * 1000);
                    packet.writeUInt16(extra);
                    player.inCamera[entity.id] = false;
                    continue;
                }
                if ((player.inCamera[entity.id] && !isInsideCamera)) {
                    player.inCamera[entity.id] = false;
                    continue;
                }
                if (!entity.isUpdated() && player.inCamera[entity.id] && isInsideCamera)
                    continue;
                if (isInsideCamera) {
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
            if (packet.getLength() > 3) {
                client.sendBinary(packet.toBuffer());
            }
        }
        if (now - this.timestamp >= 1000) {
            this.timestamp = now;
        }
        for (const entity of Object.values(this.entities)) {
            if (!entity)
                continue;
            entity.action &= ~action_type_1.ActionType.WEB;
            entity.action &= ~action_type_1.ActionType.HEAL;
            entity.action &= ~action_type_1.ActionType.ATTACK;
            entity.action &= ~action_type_1.ActionType.HUNGER;
            entity.action &= ~action_type_1.ActionType.COLD;
            entity.action &= ~action_type_1.ActionType.HURT;
            // entity.oldType = entity.type;
            entity.oldPosition.set(entity.position);
            entity.oldAngle = entity.angle;
            entity.oldAction = entity.action;
            entity.oldSpeed = entity.speed;
            entity.oldInfo = entity.info;
            entity.oldExtra = entity.extra;
            if (entity.action === action_type_1.ActionType.DELETE) {
                if (entity instanceof player_1.default) {
                    const crate = new crate_1.Crate(this, {
                        owner: entity,
                        type: "dead"
                    });
                    crate.id = this.entityPool.generate();
                    this.entities[crate.id] = crate;
                    this.playerPool.free(entity.id);
                    this.broadcast(new Uint8Array([packets_1.ClientPackets.KILL_PLAYER, entity.id]), true, entity.client.socket);
                    entity.reset();
                    this.entities[entity.id] = undefined;
                }
                else {
                    this.entityPool.free(entity.id);
                    this.entities[entity.id] = undefined;
                }
            }
        }
    }
    findPlayerByToken(token, token_id) {
        return this.alivePlayers.find(player => player.token === token && player.token_id === token_id);
    }
    restart() {
        this.configSystem = new config_system_1.ConfigSystem(this);
        for (const client of this.wss.clients.values()) {
            client.socket.close();
        }
        this.wss.app.close();
        this.wss = new websocket_server_1.WebSocketServer(this);
        this.world = new world_1.World(this);
        this.kitSystem = new kit_system_1.KitSystem(this.config);
        this.eventSystem = new event_system_1.EventSystem(this);
    }
}
exports.Server = Server;
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
process.on("exit", async () => {
    await server.saveSystem.save();
});
