"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDefaultMarket = void 0;
const item_type_1 = require("../enums/types/item.type");
const defaultMarket = [
    [item_type_1.ItemType.BERRY, 1, item_type_1.ItemType.WOOD, 3],
    [item_type_1.ItemType.PUMPKIN, 1, item_type_1.ItemType.STONE, 4],
    [item_type_1.ItemType.BREAD, 1, item_type_1.ItemType.GOLD, 6],
    [item_type_1.ItemType.CARROT, 1, item_type_1.ItemType.DIAMOND, 1],
    [item_type_1.ItemType.TOMATO, 1, item_type_1.ItemType.AMETHYST, 1],
    [item_type_1.ItemType.THORNBUSH, 1, item_type_1.ItemType.REIDITE, 1],
    [item_type_1.ItemType.BREAD, 10, item_type_1.ItemType.PUMPKIN_SEED, 1],
    [item_type_1.ItemType.PUMPKIN, 16, item_type_1.ItemType.CARROT_SEED, 1],
    [item_type_1.ItemType.CARROT, 20, item_type_1.ItemType.TOMATO_SEED, 1],
    [item_type_1.ItemType.TOMATO, 30, item_type_1.ItemType.THORNBUSH_SEED, 1],
    [item_type_1.ItemType.THORNBUSH, 40, item_type_1.ItemType.GARLIC_SEED, 1],
    [item_type_1.ItemType.GARLIC, 60, item_type_1.ItemType.WATERMELON_SEED, 1]
];
const getDefaultMarket = function () {
    return defaultMarket.slice();
};
exports.getDefaultMarket = getDefaultMarket;
