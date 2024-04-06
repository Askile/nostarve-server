import {ItemType} from "../enums/types/item.type";

const defaultMarket = [
    [ItemType.BERRY, 1, ItemType.WOOD, 3],
    [ItemType.PUMPKIN, 1, ItemType.STONE, 4],
    [ItemType.BREAD, 1, ItemType.GOLD, 6],
    [ItemType.CARROT, 1, ItemType.DIAMOND, 1],
    [ItemType.TOMATO, 1, ItemType.AMETHYST, 1],
    [ItemType.THORNBUSH, 1, ItemType.REIDITE, 1],
    [ItemType.BREAD, 10, ItemType.PUMPKIN_SEED, 1],
    [ItemType.PUMPKIN, 16, ItemType.CARROT_SEED, 1],
    [ItemType.CARROT, 20, ItemType.TOMATO_SEED, 1],
    [ItemType.TOMATO, 30, ItemType.THORNBUSH_SEED, 1],
    [ItemType.THORNBUSH, 40, ItemType.GARLIC_SEED, 1],
    [ItemType.GARLIC, 60, ItemType.WATERMELON_SEED, 1]
];

export const getDefaultMarket = function() {
    return defaultMarket.slice();
}
