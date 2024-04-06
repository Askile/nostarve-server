"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuildingSystem = void 0;
const entity_type_1 = require("../enums/types/entity.type");
const player_1 = __importDefault(require("../entities/player"));
const item_type_1 = require("../enums/types/item.type");
const utils_1 = require("../modules/utils");
const tile_type_1 = require("../enums/types/tile.type");
const state_type_1 = require("../enums/types/state.type");
const crate_1 = require("../entities/crate");
const packets_1 = require("../enums/packets");
const building_utils_1 = __importDefault(require("./building.utils"));
const physics_1 = __importDefault(require("../physics/physics"));
const building_1 = __importDefault(require("./building"));
const binary_writer_1 = require("../modules/binary.writer");
class BuildingSystem {
    server;
    queue;
    shakeQueue;
    constructor(server) {
        this.server = server;
        this.queue = [];
        this.shakeQueue = [];
    }
    addShake(angle, id) {
        this.shakeQueue.push([angle, id]);
    }
    tick() {
        const now = Date.now();
        if (this.queue.length) {
            for (const request of this.queue) {
                const [player, position, id, type, angle, isGrid] = request;
                if (
                // Build delay
                now - player.timestamps.get("build") <= this.server.config.build_delay ||
                    // Totem delay
                    ((now - player.timestamps.get("join_totem") < 30000 || player.totem?.data.length > 0) && type === entity_type_1.EntityType.TOTEM) ||
                    // Player does not have an item
                    !player.inventory.contains(id, 1) ||
                    // Player already has a machine
                    (player.machine && type === entity_type_1.EntityType.EMERALD_MACHINE))
                    continue;
                let building = new building_1.default(type, player, this.server);
                building.angle = angle;
                building.position.set(utils_1.Utils.getOffsetVector(player.realPosition, 120, angle));
                if (isGrid || building.hasComponent("GRID" /* ComponentType.GRID */) || (building.isSeed() && building.hasState(state_type_1.StateType.IN_PLOT))) {
                    building.angle = 0;
                    building.position.x = Math.floor(building.position.x / 100) * 100 + 50;
                    building.position.y = Math.floor(building.position.y / 100) * 100 + 50;
                }
                building.realPosition.set(building.position);
                if (building.position.x < 0 || building.position.y < 0 || building.position.x > this.server.world.width || building.position.y > this.server.world.height)
                    return;
                physics_1.default.updateState(building);
                let continueLoop = false;
                const entities = this.server.world.getEntities(building.position.x, building.position.y, 2);
                const tiles = this.server.world.getTiles(building.position.x, building.position.y, 2);
                const thisChunk = this.server.world.getChunk(building.position.x, building.position.y);
                for (const entity of thisChunk.entities) {
                    if (entity.type === building.type && entity.hasComponent("GRID" /* ComponentType.GRID */) && building.hasComponent("GRID" /* ComponentType.GRID */)) {
                        continueLoop = true;
                    }
                }
                if (continueLoop)
                    continue;
                // Cancel if building is in water
                if (!building.hasComponent("GRID" /* ComponentType.GRID */) &&
                    building.hasState(state_type_1.StateType.IN_WATER) &&
                    !building.hasState(state_type_1.StateType.IN_BRIDGE) &&
                    !building.hasState(state_type_1.StateType.IN_ISLAND))
                    continue;
                if (building.isSeed() &&
                    ((building.hasState(state_type_1.StateType.IN_PLOT) &&
                        building.hasState(state_type_1.StateType.IN_SEED)) ||
                        (!building.hasState(state_type_1.StateType.IN_PLOT) &&
                            (building.hasState(state_type_1.StateType.IN_WATER) ||
                                building.hasState(state_type_1.StateType.IN_WINTER) ||
                                building.hasState(state_type_1.StateType.IN_LAVA_BIOME) ||
                                building.hasState(state_type_1.StateType.IN_DESERT)))))
                    continue;
                if (building.type === entity_type_1.EntityType.EMERALD_MACHINE &&
                    building.hasState(state_type_1.StateType.IN_WATER) &&
                    !building.hasState(state_type_1.StateType.IN_ISLAND))
                    continue;
                if (!building.noCheck()) {
                    for (const entity of entities) {
                        const dist = entity.realPosition.distance(building.position);
                        if (dist < entity.radius + 45 &&
                            !entity.hasState(state_type_1.StateType.GHOST) &&
                            !(entity instanceof player_1.default && entity.flight) &&
                            !(entity instanceof crate_1.Crate) &&
                            !(entity instanceof building_1.default && entity.noCheck())) {
                            continueLoop = true;
                        }
                    }
                    if (continueLoop)
                        continue;
                    for (const tile of tiles) {
                        const dist = tile.realPosition.distance(building.position);
                        if (building.hasState(state_type_1.StateType.IN_BRIDGE) && !tile.collide)
                            continue;
                        if (dist < tile.radius + building.radius && tile.type !== tile_type_1.TileType.SAND)
                            continueLoop = true;
                    }
                    if (continueLoop)
                        continue;
                }
                player.timestamps.set("build", now);
                player.inventory.decrease(id, 1);
                player.client.sendU8([packets_1.ClientPackets.ACCEPT_BUILD, id]);
                player.addBuilding(building);
                building.onPlaced();
            }
            this.queue = [];
        }
        if (this.shakeQueue.length) {
            const writer = new binary_writer_1.BinaryWriter();
            writer.writeUInt8(packets_1.ClientPackets.HITTEN_OTHER);
            for (const [angle, id] of this.shakeQueue) {
                writer.writeUInt8(angle);
                writer.writeUInt16(id);
            }
            this.server.broadcast(writer.toBuffer(), true);
            this.shakeQueue = [];
        }
    }
    request(player, data) {
        const now = Date.now();
        if (player.flight || now - player.timestamps.get("build") <= this.server.config.build_delay)
            return;
        const id = data[0];
        const type = entity_type_1.EntityType[item_type_1.ItemType[id]];
        const angle = data[1];
        const isGrid = data[2];
        if (!building_utils_1.default.checkBuildingRequest(data))
            return;
        if (player.buildings[type] && player.buildings[type].length > this.server.content.entities[type].limit)
            return;
        const placePosition = utils_1.Utils.getOffsetVector(player.realPosition, 120, angle);
        if (isGrid || this.server.content.entities[type].bool?.includes("GRID")) {
            placePosition.x = Math.floor(placePosition.x / 100) * 100 + 50;
            placePosition.y = Math.floor(placePosition.y / 100) * 100 + 50;
        }
        if (this.queue.findIndex(el => el[1].distance(placePosition) < this.server.configSystem.entityRadius[type] + this.server.configSystem.entityRadius[el[3]]) !== -1)
            return;
        this.queue.push([player, placePosition, id, type, angle, isGrid]);
    }
}
exports.BuildingSystem = BuildingSystem;
