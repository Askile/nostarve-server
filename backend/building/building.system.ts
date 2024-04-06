import {Server} from "../server";
import {EntityType} from "../enums/types/entity.type";
import Player from "../entities/player";
import {ItemType} from "../enums/types/item.type";
import {Utils} from "../modules/utils";
import {TileType} from "../enums/types/tile.type";
import {StateType} from "../enums/types/state.type";
import {Crate} from "../entities/crate";
import {ClientPackets} from "../enums/packets";
import BuildingUtils from "./building.utils";
import Physics from "../physics/physics";
import {ComponentType} from "../enums/types/component.type";
import Building from "./building";
import {BinaryWriter} from "../modules/binary.writer";

export class BuildingSystem {
    private readonly server: Server;
    private queue: any[];
    private shakeQueue: any[];

    constructor(server: Server) {
        this.server = server;
        this.queue = [];
        this.shakeQueue = [];
    }

    public addShake(angle: number, id: number) {
        this.shakeQueue.push([angle, id]);
    }

    public tick() {
        const now = Date.now();
        if(this.queue.length) {
            for (const request of this.queue) {
                const [player, position, id, type, angle, isGrid] = request;

                if (
                    // Build delay
                    now - player.timestamps.get("build") <= this.server.config.build_delay ||
                    // Totem delay
                    ((now - player.timestamps.get("join_totem") < 30000 || player.totem?.data.length > 0) && type === EntityType.TOTEM) ||
                    // Player does not have an item
                    !player.inventory.contains(id, 1) ||
                    // Player already has a machine
                    (player.machine && type === EntityType.EMERALD_MACHINE)
                ) continue;

                let building = new Building(type, player, this.server);

                building.angle = angle;
                building.position.set(Utils.getOffsetVector(player.realPosition, 120, angle));

                if (isGrid || building.hasComponent(ComponentType.GRID) || (building.isSeed() && building.hasState(StateType.IN_PLOT))) {
                    building.angle = 0;

                    building.position.x = Math.floor(building.position.x / 100) * 100 + 50;
                    building.position.y = Math.floor(building.position.y / 100) * 100 + 50;
                }

                building.realPosition.set(building.position);

                if (building.position.x < 0 || building.position.y < 0 || building.position.x > this.server.world.width || building.position.y > this.server.world.height) return;

                Physics.updateState(building);

                let continueLoop = false;
                const entities = this.server.world.getEntities(building.position.x, building.position.y, 2);
                const tiles = this.server.world.getTiles(building.position.x, building.position.y, 2);
                const thisChunk = this.server.world.getChunk(building.position.x, building.position.y);

                for (const entity of thisChunk.entities) {
                    if(entity.type === building.type && entity.hasComponent(ComponentType.GRID) && building.hasComponent(ComponentType.GRID)) {
                        continueLoop = true;
                    }
                }

                if (continueLoop) continue;
                // Cancel if building is in water
                if (
                    !building.hasComponent(ComponentType.GRID) &&
                    building.hasState(StateType.IN_WATER) &&
                    !building.hasState(StateType.IN_BRIDGE) &&
                    !building.hasState(StateType.IN_ISLAND)
                ) continue;

                if (
                    building.isSeed() &&
                    (
                        (
                            building.hasState(StateType.IN_PLOT) &&
                            building.hasState(StateType.IN_SEED)
                        ) ||
                        (
                            !building.hasState(StateType.IN_PLOT) &&
                            (
                                building.hasState(StateType.IN_WATER) ||
                                building.hasState(StateType.IN_WINTER) ||
                                building.hasState(StateType.IN_LAVA_BIOME) ||
                                building.hasState(StateType.IN_DESERT)
                            )
                        )
                    )
                ) continue;

                if (
                    building.type === EntityType.EMERALD_MACHINE &&
                    building.hasState(StateType.IN_WATER) &&
                    !building.hasState(StateType.IN_ISLAND)
                ) continue;

                if (!building.noCheck()) {
                    for (const entity of entities) {
                        const dist = entity.realPosition.distance(building.position);
                        if (
                            dist < entity.radius + 45 &&
                            !entity.hasState(StateType.GHOST) &&
                            !(entity instanceof Player && entity.flight) &&
                            !(entity instanceof Crate) &&
                            !(entity instanceof Building && entity.noCheck())
                        ) {
                            continueLoop = true;
                        }
                    }

                    if (continueLoop) continue;

                    for (const tile of tiles) {
                        const dist = tile.realPosition.distance(building.position);
                        if (building.hasState(StateType.IN_BRIDGE) && !tile.collide) continue;

                        if (dist < tile.radius + building.radius && tile.type !== TileType.SAND) continueLoop = true;
                    }

                    if (continueLoop) continue;
                }

                player.timestamps.set("build", now);
                player.inventory.decrease(id, 1);
                player.client.sendU8([ClientPackets.ACCEPT_BUILD, id]);
                player.addBuilding(building);
                building.onPlaced();
            }

            this.queue = [];
        }

        if(this.shakeQueue.length) {
            const writer = new BinaryWriter();
            writer.writeUInt8(ClientPackets.HITTEN_OTHER);

            for (const [angle, id] of this.shakeQueue) {
                writer.writeUInt8(angle);
                writer.writeUInt16(id);
            }

            this.server.broadcast(writer.toBuffer(), true);
            this.shakeQueue = [];
        }
    }

    public request(player: Player, data: number[]) {
        const now = Date.now();
        if (player.flight || now - player.timestamps.get("build") <= this.server.config.build_delay) return;

        const id = data[0];
        const type = EntityType[ItemType[id] as any] as any;
        const angle = data[1];
        const isGrid = data[2];
        if(!BuildingUtils.checkBuildingRequest(data)) return;

        if (player.buildings[type] && player.buildings[type].length > this.server.content.entities[type].limit) return;
        const placePosition = Utils.getOffsetVector(player.realPosition, 120, angle);
        if (isGrid || this.server.content.entities[type].bool?.includes("GRID")) {
            placePosition.x = Math.floor(placePosition.x / 100) * 100 + 50;
            placePosition.y = Math.floor(placePosition.y / 100) * 100 + 50;
        }

        if(this.queue.findIndex(el => el[1].distance(placePosition) < this.server.configSystem.entityRadius[type] + this.server.configSystem.entityRadius[el[3]]) !== -1) return;
        this.queue.push([player, placePosition, id, type, angle, isGrid]);
    }
}