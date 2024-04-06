import {Server} from "../server";
import Player from "../entities/player";
import {ItemType} from "../enums/types/item.type";
import {IdPool} from "../modules/id.pool";

interface GameEvent {
    id: number;
    type: string;
    repeat: number;
    commands: string[];
}

interface InventoryEvent extends GameEvent {
    item: number;
    amount: number;
}

interface LocationEvent extends GameEvent {
    x: number;
    y: number;
    sx?: number;
    sy?: number;
    ex?: number;
    ey?: number;
}

interface LocationInventoryEvent extends GameEvent, InventoryEvent, LocationEvent {}
interface TimeEvent extends GameEvent {}
interface KillEvent extends GameEvent {kill: number}
interface ScoreEvent extends GameEvent {score: number}

export class EventSystem {
    public eventPool: IdPool;
    private server: Server;
    private lastEvent: number[] = [];
    private locationInventoryEvents: LocationInventoryEvent[] = [];
    private inventoryEvents: InventoryEvent[] = [];
    private locationEvents: LocationEvent[] = [];
    private killEvents: KillEvent[] = [];
    private timeEvents: TimeEvent[] = [];
    private scoreEvents: ScoreEvent[] = [];
    constructor(server: Server) {
        this.server = server;

        this.eventPool = new IdPool(0);

        this.initEvents();
    }

    private initEvents(){
        if(!this.server.config.important.events) return;
        for (let event of this.server.config.important.events) {
            event.id = this.eventPool.generate();
            if(event.item) {
                event.item = ItemType[event.item.toUpperCase()];
            }

            if(event.repeat) {
                event.repeat *= 1000;
            }

            switch(event.type) {
                case "inventory":
                    this.inventoryEvents.push(event);
                    break;
                case "location":
                    this.locationEvents.push(event);
                    break;
                case "score":
                    this.scoreEvents.push(event);
                    break;
                case "kill":
                    this.killEvents.push(event);
                    break;
                case "locationInventory":
                    this.locationInventoryEvents.push(event);
                    break;
                case "time":
                    this.timeEvents.push(event);
                    break;
                default:
                    break;
            }
        }
    }

    public tick() {
        const now = Date.now();

        for (const player of this.server.alivePlayers) {
            for (const event of this.scoreEvents) {
                if(!event.commands.length) continue;
                    if(player.lastEvent[event.id] !== -1 && player.score >= event.score) {
                        this.commandsArray(player, event);
                        player.lastEvent[event.id] = -1;
                    }
            }

            for (const event of this.killEvents) {
                if(!event.commands.length) continue;
                if(player.lastEvent[event.id] !== -1 && player.kills >= event.kill) {
                    this.commandsArray(player, event);
                    player.lastEvent[event.id] = -1;
                }
            }

            for (const event of this.inventoryEvents) {
                if(!event.commands.length) continue;
                if(!player.inventory.contains(event.item, event.amount)) continue;
                if(now - player.lastEvent[event.id] >= event.repeat) {
                    this.commandsArray(player, event);
                    player.lastEvent[event.id] = now;
                }
            }
        }

        for (const event of this.locationInventoryEvents) {
            if(!event.commands.length) continue;
            const isCube =
                typeof event.sx === "number" && typeof event.sy === "number" &&
                typeof event.ex === "number" && typeof event.ey === "number";
            if(isCube) {
                for (const player of this.server.alivePlayers) {
                    const pos = player.realPosition.divide(100).floor();
                    player.lastEvent[event.id] ??= now;
                    if(player.lastEvent[event.id] === -1) continue;
                    if(player.inventory.contains(event.item, event.amount) &&
                        now - player.lastEvent[event.id] >= event.repeat &&
                        event.sx <= pos.x &&
                        pos.x <= event.ex &&
                        event.sy <= pos.y &&
                        pos.y <= event.ey
                    ) {
                        this.commandsArray(player, event);
                        player.lastEvent[event.id] = event.repeat === 0 ? -1 : now;
                    }
                }
            } else {
                const thisChunk = this.server.world.grid[event.y][event.x];

                if(!thisChunk) continue;

                for (const player of thisChunk.entities) {
                    if(!(player instanceof Player)) continue;
                    if(player.lastEvent[event.id] === -1) continue;
                    player.lastEvent[event.id] ??= now;
                    if(player.inventory.contains(event.item, event.amount) && now - player.lastEvent[event.id] >= event.repeat) {
                        this.commandsArray(player, event);
                        player.lastEvent[event.id] = event.repeat === 0 ? -1 : now;
                    }
                }
            }
        }

        for (const event of this.timeEvents) {
            if(!event.commands.length) continue;

            if(event.repeat === 0) {
                for (const command of event.commands) {
                    this.server.commandSystem.handleServerCommand(command);
                }
                this.timeEvents = this.timeEvents.filter(e => e !== event);
            } else {
                this.lastEvent[event.id] ??= now;
                if(now - this.lastEvent[event.id] >= event.repeat) {
                    this.lastEvent[event.id] = now;
                    for (const command of event.commands) {
                        this.server.commandSystem.handleServerCommand(command);
                    }
                }
            }
        }

        for (const event of this.locationEvents) {
            if(!event.commands.length) continue;

            const isCube =
                typeof event.sx === "number" && typeof event.sy === "number" &&
                typeof event.ex === "number" && typeof event.ey === "number";

            if(isCube) {
                for (const player of this.server.alivePlayers) {
                    const pos = player.realPosition.divide(100).floor();
                    if(player.lastEvent[event.id] === -1) continue;
                    player.lastEvent[event.id] ??= now;
                    if(now - player.lastEvent[event.id] >= event.repeat &&
                        event.sx <= pos.x &&
                        pos.x <= event.ex &&
                        event.sy <= pos.y &&
                        pos.y <= event.ey
                    ) {
                        this.commandsArray(player, event);
                        player.lastEvent[event.id] = event.repeat === 0 ? -1 : now;
                    }
                }

            } else {
                const thisChunk = this.server.world.grid[event.y][event.x];
                if(!thisChunk) continue;
                for (const player of thisChunk.entities) {
                    if(!(player instanceof Player)) continue;
                    if(player.lastEvent[event.id] === -1) continue;

                    player.lastEvent[event.id] ??= now;

                    if(now - player.lastEvent[event.id] >= event.repeat) {
                        this.commandsArray(player, event);
                        player.lastEvent[event.id] = event.repeat === 0 ? -1 : now;
                    }
                }
            }
        }
    }

    public commandsArray(player: Player, event: GameEvent) {
        for (const command of event.commands) {
            this.server.commandSystem.handleServerCommand(command, player);
        }
    }
}