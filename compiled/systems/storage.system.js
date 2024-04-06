"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageSystem = void 0;
const item_type_1 = require("../enums/types/item.type");
const entity_type_1 = require("../enums/types/entity.type");
const utils_1 = require("../modules/utils");
const team_system_1 = __importDefault(require("../team/team.system"));
class StorageSystem {
    server;
    constructor(server) {
        this.server = server;
    }
    giveChestItem(player, [id, isShift]) {
        if (!Number.isInteger(id) ||
            !Number.isInteger(isShift))
            return;
        const chest = player.nearestBuildings[entity_type_1.EntityType.CHEST];
        if (chest === undefined || chest.position.distance(player.realPosition) > 100)
            return;
        const info = chest.info & ~0x2000;
        const count = Math.min(isShift ? 10 : 1, player.inventory.count(id), 8000 - info);
        if (count <= 0)
            return;
        const locked = chest.info & 0x2000;
        const enemy = team_system_1.default.isEnemy(player, chest.owner);
        const full = info + count > 8000;
        const changed = chest.extra !== id && chest.extra > 0;
        if ((locked && enemy) || full || changed)
            return;
        this.server.logger.log(`[Chest] ${player.nickname}|${player.id} gave x${count} ${item_type_1.ItemType[id]}`);
        chest.extra = id;
        chest.info += count;
        player.inventory.decrease(id, count, true);
    }
    takeChestItem(player) {
        const chest = player.nearestBuildings[entity_type_1.EntityType.CHEST];
        if (chest === undefined || chest.position.distance(player.realPosition) > 100)
            return;
        const info = chest.info & ~0x2000;
        const locked = chest.info & 0x2000 && team_system_1.default.isEnemy(player, chest.owner);
        if (locked || chest.extra <= 1)
            return;
        const count = Math.min(255, info);
        player.inventory.increase(chest.extra, count, true);
        chest.info = Math.max(chest.info - count, 0);
        if (info - count <= 0) {
            chest.extra = 0;
        }
    }
    lockChest(player) {
        const chest = player.nearestBuildings[entity_type_1.EntityType.CHEST];
        if (chest === undefined || chest.position.distance(player.realPosition) > 100)
            return;
        if (chest.info & 0x2000)
            return;
        if (player.inventory.contains(item_type_1.ItemType.LOCK)) {
            player.inventory.decrease(item_type_1.ItemType.LOCK, 1, true);
            chest.info += 0x2000;
        }
    }
    unlockChest(player) {
        const chest = player.nearestBuildings[entity_type_1.EntityType.CHEST];
        if (!chest || !(chest.info & 0x2000))
            return;
        if (player.inventory.contains(item_type_1.ItemType.LOCK_PICK)) {
            player.inventory.decrease(item_type_1.ItemType.LOCK_PICK, 1, true);
            chest.info -= 0x2000;
        }
    }
    giveWoodExtractor(player, isShift) {
        const extractor = this.server.world.getNearest(player, [
            entity_type_1.EntityType.STONE_EXTRACTOR, entity_type_1.EntityType.GOLD_EXTRACTOR, entity_type_1.EntityType.DIAMOND_EXTRACTOR,
            entity_type_1.EntityType.AMETHYST_EXTRACTOR, entity_type_1.EntityType.REIDITE_EXTRACTOR
        ], 100);
        if (extractor) {
            if (extractor.data[0] === -1)
                extractor.data[0] = 0;
            let count = Math.min(isShift ? 10 : 1, player.inventory.count(item_type_1.ItemType.WOOD), 255 - extractor.data[0]);
            extractor.data[0] += count;
            player.inventory.decrease(item_type_1.ItemType.WOOD, count, true);
        }
    }
    takeResourceExtractor(player) {
        const extractor = this.server.world.getNearest(player, [
            entity_type_1.EntityType.REIDITE_EXTRACTOR, entity_type_1.EntityType.AMETHYST_EXTRACTOR, entity_type_1.EntityType.DIAMOND_EXTRACTOR,
            entity_type_1.EntityType.GOLD_EXTRACTOR, entity_type_1.EntityType.STONE_EXTRACTOR
        ], 100);
        if (extractor) {
            if (extractor.owner.id !== player.id)
                player.ruinQuests();
            let item = utils_1.Utils.getItemInStorage(extractor.type);
            player.inventory.increase(item, extractor.data[1], true);
            extractor.data[1] = 0;
        }
    }
    giveWheat(player, isShift) {
        const windmill = this.server.world.getNearest(player, [entity_type_1.EntityType.WINDMILL], 100);
        if (windmill) {
            const count = Math.min(255, isShift ? 10 : 1, player.inventory.count(item_type_1.ItemType.WHEAT), 255 - windmill.data[0]);
            windmill.data[0] += count;
            player.inventory.decrease(item_type_1.ItemType.WHEAT, count, true);
        }
    }
    takeFlour(player) {
        const windmill = this.server.world.getNearest(player, [entity_type_1.EntityType.WINDMILL], 100);
        if (windmill) {
            if (windmill.owner.id !== player.id)
                player.ruinQuests();
            player.inventory.increase(item_type_1.ItemType.FLOUR, windmill.data[1], true);
            windmill.data[1] = 0;
        }
    }
    giveFurnace(player, isShift) {
        const furnace = this.server.world.getNearest(player, [entity_type_1.EntityType.FURNACE], 100);
        if (furnace) {
            const count = Math.min(1000, isShift ? 10 : 1, player.inventory.count(item_type_1.ItemType.WOOD), 1000 - furnace.data[0]);
            furnace.data[0] += count;
            player.inventory.decrease(item_type_1.ItemType.WOOD, count, true);
        }
    }
    giveWell(player) {
        const well = this.server.world.getNearest(player, [entity_type_1.EntityType.WELL], 100);
        if (well.type === entity_type_1.EntityType.WELL) {
            if (well.position.distance(player.realPosition) > 100 || !player.inventory.contains(item_type_1.ItemType.BUCKET_FULL))
                return;
            well.data[0] += 8;
            well.info = 1;
            player.inventory.decrease(item_type_1.ItemType.BUCKET_FULL, 1, true);
        }
    }
    giveWoodOven(player, isShift) {
        const oven = this.server.world.getNearest(player, [entity_type_1.EntityType.BREAD_OVEN], 100);
        if (oven) {
            const count = Math.min(31, isShift ? 10 : 1, player.inventory.count(item_type_1.ItemType.WOOD), 31 - oven.data[0]);
            oven.data[0] += count;
            player.inventory.decrease(item_type_1.ItemType.WOOD, count, true);
        }
    }
    giveFlourOven(player, isShift) {
        const oven = this.server.world.getNearest(player, [entity_type_1.EntityType.BREAD_OVEN], 100);
        if (oven) {
            const count = Math.min(31, isShift ? 10 : 1, player.inventory.count(item_type_1.ItemType.FLOUR), 31 - oven.data[1]);
            oven.data[1] += count;
            player.inventory.increase(item_type_1.ItemType.FLOUR, count, true);
        }
    }
    takeBread(player) {
        const oven = this.server.world.getNearest(player, [entity_type_1.EntityType.BREAD_OVEN], 100);
        if (oven) {
            if (oven.owner.id !== player.id)
                player.ruinQuests();
            player.inventory.increase(item_type_1.ItemType.BREAD, oven.data[2], true);
            oven.data[2] = 0;
        }
    }
}
exports.StorageSystem = StorageSystem;
