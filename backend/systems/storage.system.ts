import {Server} from "../server";
import Player from "../entities/player";
import Building from "../building/building";
import {ItemType} from "../enums/types/item.type";
import {EntityType} from "../enums/types/entity.type";
import {Utils} from "../modules/utils";
import TeamSystem from "../team/team.system";

export class StorageSystem {
    public server: Server;
    constructor(server: Server) {
        this.server = server;
    }

    public giveChestItem(player: Player, [id, isShift]: [number, number]) {
        if (
            !Number.isInteger(id) ||
            !Number.isInteger(isShift)
        ) return;

        const chest = player.nearestBuildings[EntityType.CHEST];

        if (chest === undefined || chest.position.distance(player.realPosition) > 100) return;

        const info = chest.info &~ 0x2000;
        const count = Math.min(isShift ? 10 : 1, player.inventory.count(id), 8000 - info);

        if (count <= 0) return;

        const locked = chest.info & 0x2000;
        const enemy = TeamSystem.isEnemy(player, chest.owner);
        const full = info + count > 8000;
        const changed = chest.extra !== id && chest.extra > 0;

        if ((locked && enemy) || full || changed) return;

        this.server.logger.log(`[Chest] ${player.nickname}|${player.id} gave x${count} ${ItemType[id]}`);

        chest.extra = id;
        chest.info += count;

        player.inventory.decrease(id, count, true);
    }

    public takeChestItem(player: Player) {
        const chest = player.nearestBuildings[EntityType.CHEST];

        if (chest === undefined || chest.position.distance(player.realPosition) > 100) return;

        const info = chest.info &~ 0x2000;

        const locked = chest.info & 0x2000 && TeamSystem.isEnemy(player, chest.owner);
        if (locked || chest.extra <= 1) return;

        const count = Math.min(255, info);

        player.inventory.increase(chest.extra, count, true);

        chest.info = Math.max(chest.info - count, 0);
        if (info - count <= 0) {
            chest.extra = 0;
        }
    }

    public lockChest(player: Player) {
        const chest = player.nearestBuildings[EntityType.CHEST];

        if (chest === undefined || chest.position.distance(player.realPosition) > 100) return;
        if (chest.info & 0x2000) return;
        if (player.inventory.contains(ItemType.LOCK)) {
            player.inventory.decrease(ItemType.LOCK, 1, true);
            chest.info += 0x2000;
        }
    }

    public unlockChest(player: Player) {
        const chest = player.nearestBuildings[EntityType.CHEST];

        if (!chest || !(chest.info & 0x2000)) return;
        if (player.inventory.contains(ItemType.LOCK_PICK)) {
            player.inventory.decrease(ItemType.LOCK_PICK, 1, true);
            chest.info -= 0x2000;
        }
    }

    public giveWoodExtractor(player: Player, isShift: number) {
        const extractor = this.server.world.getNearest(player, [
            EntityType.STONE_EXTRACTOR, EntityType.GOLD_EXTRACTOR, EntityType.DIAMOND_EXTRACTOR,
            EntityType.AMETHYST_EXTRACTOR, EntityType.REIDITE_EXTRACTOR
        ], 100) as Building;

        if (extractor) {
            if (extractor.data[0] === -1) extractor.data[0] = 0;

            let count = Math.min(isShift ? 10 : 1, player.inventory.count(ItemType.WOOD), 255 - extractor.data[0]);

            extractor.data[0] += count;

            player.inventory.decrease(ItemType.WOOD, count, true);
        }
    }

    public takeResourceExtractor(player: Player) {
        const extractor = this.server.world.getNearest(player, [
            EntityType.REIDITE_EXTRACTOR, EntityType.AMETHYST_EXTRACTOR, EntityType.DIAMOND_EXTRACTOR,
            EntityType.GOLD_EXTRACTOR, EntityType.STONE_EXTRACTOR
        ], 100) as Building;

        if (extractor) {
            if (extractor.owner.id !== player.id) player.ruinQuests();

            let item = Utils.getItemInStorage(extractor.type);

            player.inventory.increase(item, extractor.data[1], true);
            extractor.data[1] = 0;
        }
    }

    public giveWheat(player: Player, isShift: number) {
        const windmill = this.server.world.getNearest(player, [EntityType.WINDMILL], 100) as Building;

        if (windmill) {
            const count = Math.min(255, isShift ? 10 : 1, player.inventory.count(ItemType.WHEAT), 255 - windmill.data[0]);

            windmill.data[0] += count;

            player.inventory.decrease(ItemType.WHEAT, count, true);
        }
    }

    public takeFlour(player: Player) {
        const windmill = this.server.world.getNearest(player, [EntityType.WINDMILL], 100) as Building;

        if (windmill) {
            if (windmill.owner.id !== player.id) player.ruinQuests();

            player.inventory.increase(ItemType.FLOUR, windmill.data[1], true);
            windmill.data[1] = 0;
        }
    }

    public giveFurnace(player: Player, isShift: number) {
        const furnace = this.server.world.getNearest(player, [EntityType.FURNACE], 100) as Building;

        if (furnace) {
            const count = Math.min(1000, isShift ? 10 : 1, player.inventory.count(ItemType.WOOD), 1000 - furnace.data[0]);

            furnace.data[0] += count;

            player.inventory.decrease(ItemType.WOOD, count, true);
        }
    }

    public giveWell(player: Player) {
        const well = this.server.world.getNearest(player, [EntityType.WELL], 100) as Building;

        if (well.type === EntityType.WELL) {
            if (well.position.distance(player.realPosition) > 100 || !player.inventory.contains(ItemType.BUCKET_FULL)) return;

            well.data[0] += 8;
            well.info = 1;

            player.inventory.decrease(ItemType.BUCKET_FULL, 1, true);
        }
    }

    public giveWoodOven(player: Player, isShift: number) {
        const oven = this.server.world.getNearest(player, [EntityType.BREAD_OVEN], 100) as Building;

        if (oven) {
            const count = Math.min(31, isShift ? 10 : 1, player.inventory.count(ItemType.WOOD), 31 - oven.data[0]);

            oven.data[0] += count;

            player.inventory.decrease(ItemType.WOOD, count, true);
        }
    }

    public giveFlourOven(player: Player, isShift: number) {
        const oven = this.server.world.getNearest(player, [EntityType.BREAD_OVEN], 100) as Building;

        if (oven) {
            const count = Math.min(31, isShift ? 10 : 1, player.inventory.count(ItemType.FLOUR), 31 - oven.data[1]);

            oven.data[1] += count;

            player.inventory.increase(ItemType.FLOUR, count, true);
        }
    }

    public takeBread(player: Player) {
        const oven = this.server.world.getNearest(player, [EntityType.BREAD_OVEN], 100) as Building;

        if (oven) {
            if (oven.owner.id !== player.id) player.ruinQuests();

            player.inventory.increase(ItemType.BREAD, oven.data[2], true);

            oven.data[2] = 0;
        }
    }

}