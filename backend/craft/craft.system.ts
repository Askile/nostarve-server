import Craft from "./craft";
import {Server} from "../server";
import {ItemType} from "../enums/types/item.type";
import Player from "../entities/player";
import {StateType} from "../enums/types/state.type";
import {ClientPackets} from "../enums/packets";
import {RECIPES} from "../default/default.recipes";

interface Process {
    isRecycle: boolean;
    endAt: number;
    craftId: number;
}
export default class CraftSystem {
    private server: Server;

    public processes: Map<number, Process> = new Map();
    public crafts: Craft[];

    constructor(server: Server) {
        this.server = server;

        this.processes = new Map();
        this.crafts = RECIPES.slice();

        if (this.server.config.important.recipes) {
            for (let craft of this.server.config.important.recipes as any) {
                craft.id = ItemType[craft.item.toUpperCase()];
                craft.r = craft.recipe.map((rec: any) => [ItemType[rec[0].toUpperCase()], rec[1]]);
                craft.w = craft.workbench;

                delete craft.workbench;
                delete craft.item;
                delete craft.recipe;

                this.crafts[craft.id] = craft;
            }
        }

        if(this.server.config.instant_craft === 1) {
            for (const craft of this.crafts) {
                if(!craft) continue;
                craft.time = 0;
            }
        }
    }

    public tick() {
        const now = Date.now();

        for (const playerId of this.processes.keys()) {
            const player = this.server.players[playerId];
            if(!player.hasState(StateType.CRAFT)) continue;

            const proc = this.processes.get(playerId);
            const craft = this.crafts[proc.craftId];

            if(proc.isRecycle) {
                if(proc.endAt < now) {
                    for (const [id, count] of craft.r) {
                        if (count === 1) continue;

                        player.inventory.increase(id, Math.floor(count * 0.8));
                    }

                    player.client.sendBinary(new Uint8Array([ClientPackets.RECYCLE_STOP, proc.craftId]));
                    player.removeState(StateType.CRAFT);

                    this.processes.delete(playerId);
                }
            } else {
                if(proc.endAt < now) {
                    player.client.sendU8([ClientPackets.BUILD_STOP, (proc.craftId === ItemType.BOTTLE_FULL_2 || proc.craftId === ItemType.BOTTLE_FULL_3) ? ItemType.BOTTLE_FULL : proc.craftId]);
                    player.inventory.increase((proc.craftId === ItemType.BOTTLE_FULL_2 || proc.craftId === ItemType.BOTTLE_FULL_3) ? ItemType.BOTTLE_FULL : proc.craftId, 1);

                    for (const [id, count] of craft.r) {
                        player.inventory.decrease(id, count, false);
                    }

                    if(craft.bonus) player.score += craft.bonus;

                    player.removeState(StateType.CRAFT);
                    this.processes.delete(playerId);
                }
            }
        }
    }

    public craft(player: Player, id: number) {
        if (!this.crafts[id] || player.hasState(StateType.CRAFT)) return;

        const craft = this.crafts[id];
        const endAt = Date.now() + ((player.right.id === ItemType.BOOK ? craft.time / 3 : craft.time) * 1000);

        if (
            craft.w && !player.hasState(StateType.WORKBENCH) ||
            craft.f && !player.hasState(StateType.FIRE) ||
            craft.o && !player.hasState(StateType.IN_WATER) ||
            craft.e && !player.hasState(StateType.WELL)
        ) return;

        for (const [id, count] of craft.r) {
            if (!player.inventory.contains(id, count)) {
                return;
            }
        }

        player.addState(StateType.CRAFT);
        player.client.sendU8([ClientPackets.BUILD_OK, id]);
        this.processes.set(player.id - 1, {
            isRecycle: false,
            endAt,
            craftId: id
        });
    }

    public stop(player: Player) {
        player.removeState(StateType.CRAFT);
        player.client.sendU8([ClientPackets.CANCEL_CRAFT]);
    }

    public recycle(player: Player, id: number) {
        if (!this.crafts[id] || player.hasState(StateType.CRAFT)) return;

        const craft = this.crafts[id];
        const endAt = Date.now() + (player.right.id === ItemType.BOOK ? craft.time / 3 : craft.time);

        if (
            !player.inventory.contains(id, 1) ||
            craft.w && !player.hasState(StateType.WORKBENCH) ||
            craft.f && !player.hasState(StateType.FIRE) ||
            craft.o && !player.hasState(StateType.IN_WATER) ||
            craft.e && !player.hasState(StateType.WELL)
        ) return;

        player.addState(StateType.CRAFT);
        player.client.sendU8([ClientPackets.RECYCLE_OK, id]);
        player.inventory.decrease(id, 1, true);
        this.processes.set(player.id - 1, {
            isRecycle: true,
            endAt,
            craftId: id
        });
    }
}