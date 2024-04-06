"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RECIPES = void 0;
const item_type_1 = require("../enums/types/item.type");
exports.RECIPES = [];
exports.RECIPES[item_type_1.ItemType.WOOD_SWORD] = {
    r: [
        [item_type_1.ItemType.WOOD, 30]
    ],
    f: 0,
    e: 0,
    w: 0,
    o: 0,
    time: 5,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.STONE_SWORD] = {
    r: [
        [item_type_1.ItemType.WOOD, 50],
        [item_type_1.ItemType.STONE, 25],
        [item_type_1.ItemType.WOOD_SWORD, 1]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 10,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.GOLD_SWORD] = {
    r: [
        [item_type_1.ItemType.WOOD, 60],
        [item_type_1.ItemType.GOLD, 40],
        [item_type_1.ItemType.STONE, 50],
        [item_type_1.ItemType.STONE_SWORD, 1]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 20,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.DIAMOND_SWORD] = {
    r: [
        [item_type_1.ItemType.DIAMOND, 40],
        [item_type_1.ItemType.GOLD, 60],
        [item_type_1.ItemType.STONE, 80],
        [item_type_1.ItemType.GOLD_SWORD, 1]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 30,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.AMETHYST_SWORD] = {
    r: [
        [item_type_1.ItemType.DIAMOND, 60],
        [item_type_1.ItemType.GOLD, 100],
        [item_type_1.ItemType.AMETHYST, 40],
        [item_type_1.ItemType.DIAMOND_SWORD, 1]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 60,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.REIDITE_SWORD] = {
    r: [
        [item_type_1.ItemType.DIAMOND, 100],
        [item_type_1.ItemType.AMETHYST, 80],
        [item_type_1.ItemType.REIDITE, 40],
        [item_type_1.ItemType.AMETHYST_SWORD, 1]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 90,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.DRAGON_SWORD] = {
    r: [
        [item_type_1.ItemType.DIAMOND_CORD, 20],
        [item_type_1.ItemType.DRAGON_ORB, 1],
        [item_type_1.ItemType.AMETHYST, 150],
        [item_type_1.ItemType.DRAGON_HEART, 3]
    ],
    f: 1,
    e: 0,
    w: 1,
    o: 1,
    time: 120,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.LAVA_SWORD] = {
    r: [
        [item_type_1.ItemType.DRAGON_SWORD, 1],
        [item_type_1.ItemType.LAVA_ORB, 1],
        [item_type_1.ItemType.REIDITE, 150],
        [item_type_1.ItemType.LAVA_HEART, 2]
    ],
    f: 1,
    e: 0,
    w: 1,
    o: 1,
    time: 180,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.WOOD_SPEAR] = {
    r: [
        [item_type_1.ItemType.WOOD, 40]
    ],
    f: 0,
    e: 0,
    w: 0,
    o: 0,
    time: 5,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.STONE_SPEAR] = {
    r: [
        [item_type_1.ItemType.WOOD_SPEAR, 1],
        [item_type_1.ItemType.WOOD, 60],
        [item_type_1.ItemType.STONE, 10]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 10,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.GOLD_SPEAR] = {
    r: [
        [item_type_1.ItemType.WOOD, 80],
        [item_type_1.ItemType.GOLD, 30],
        [item_type_1.ItemType.STONE, 30],
        [item_type_1.ItemType.STONE_SPEAR, 1]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 20,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.DIAMOND_SPEAR] = {
    r: [
        [item_type_1.ItemType.WOOD, 200],
        [item_type_1.ItemType.DIAMOND, 40],
        [item_type_1.ItemType.GOLD, 60],
        [item_type_1.ItemType.GOLD_SPEAR, 1]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 30,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.AMETHYST_SPEAR] = {
    r: [
        [item_type_1.ItemType.AMETHYST, 40],
        [item_type_1.ItemType.DIAMOND, 80],
        [item_type_1.ItemType.GOLD, 90],
        [item_type_1.ItemType.DIAMOND_SPEAR, 1]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 60,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.REIDITE_SPEAR] = {
    r: [
        [item_type_1.ItemType.REIDITE, 40],
        [item_type_1.ItemType.AMETHYST, 80],
        [item_type_1.ItemType.DIAMOND, 90],
        [item_type_1.ItemType.AMETHYST_SPEAR, 1]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 90,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.DRAGON_SPEAR] = {
    r: [
        [item_type_1.ItemType.DIAMOND_CORD, 20],
        [item_type_1.ItemType.DRAGON_ORB, 1],
        [item_type_1.ItemType.AMETHYST, 100],
        [item_type_1.ItemType.DRAGON_HEART, 3]
    ],
    f: 1,
    e: 0,
    w: 1,
    o: 1,
    time: 120,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.LAVA_SPEAR] = {
    r: [
        [item_type_1.ItemType.DRAGON_SPEAR, 1],
        [item_type_1.ItemType.LAVA_ORB, 1],
        [item_type_1.ItemType.REIDITE, 100],
        [item_type_1.ItemType.LAVA_HEART, 2]
    ],
    f: 1,
    e: 0,
    w: 1,
    o: 1,
    time: 200,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.CRAB_SPEAR] = {
    r: [
        [item_type_1.ItemType.WOOD_SPEAR, 1],
        [item_type_1.ItemType.CRAB_LOOT, 5],
        [item_type_1.ItemType.CORD, 6]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 30,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.WOOD_BOW] = {
    r: [
        [item_type_1.ItemType.WOOD, 100],
        [item_type_1.ItemType.CORD, 4]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 20,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.STONE_BOW] = {
    r: [
        [item_type_1.ItemType.STONE, 200],
        [item_type_1.ItemType.CORD, 8],
        [item_type_1.ItemType.PENGUIN_FEATHER, 4],
        [item_type_1.ItemType.WOOD_BOW, 1]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 25,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.GOLD_BOW] = {
    r: [
        [item_type_1.ItemType.GOLD, 200],
        [item_type_1.ItemType.CORD, 12],
        [item_type_1.ItemType.HAWK_FEATHER, 4],
        [item_type_1.ItemType.PENGUIN_FEATHER, 4],
        [item_type_1.ItemType.STONE_BOW, 1]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 30,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.DIAMOND_BOW] = {
    r: [
        [item_type_1.ItemType.DIAMOND, 200],
        [item_type_1.ItemType.DIAMOND_CORD, 10],
        [item_type_1.ItemType.HAWK_FEATHER, 8],
        [item_type_1.ItemType.PENGUIN_FEATHER, 8],
        [item_type_1.ItemType.GOLD_BOW, 1]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 35,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.AMETHYST_BOW] = {
    r: [
        [item_type_1.ItemType.AMETHYST, 200],
        [item_type_1.ItemType.DIAMOND_CORD, 10],
        [item_type_1.ItemType.PENGUIN_FEATHER, 8],
        [item_type_1.ItemType.VULTURE_FEATHER, 8],
        [item_type_1.ItemType.DIAMOND_BOW, 1]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 40,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.REIDITE_BOW] = {
    r: [
        [item_type_1.ItemType.REIDITE, 200],
        [item_type_1.ItemType.DIAMOND_CORD, 10],
        [item_type_1.ItemType.KRAKEN_FUR, 1],
        [item_type_1.ItemType.AMETHYST_BOW, 1]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 45,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.DRAGON_BOW] = {
    r: [
        [item_type_1.ItemType.EMERALD, 200],
        [item_type_1.ItemType.DIAMOND_CORD, 10],
        [item_type_1.ItemType.DRAGON_ORB, 1],
        [item_type_1.ItemType.REIDITE_BOW, 1]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 50,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.WOOD_ARROW] = {
    r: [
        [item_type_1.ItemType.WOOD, 30]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 5,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.STONE_ARROW] = {
    r: [
        [item_type_1.ItemType.STONE, 20],
        [item_type_1.ItemType.HAWK_FEATHER, 1]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 5,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.GOLD_ARROW] = {
    r: [
        [item_type_1.ItemType.GOLD, 20],
        [item_type_1.ItemType.PENGUIN_FEATHER, 1]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 10,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.DIAMOND_ARROW] = {
    r: [
        [item_type_1.ItemType.DIAMOND, 10],
        [item_type_1.ItemType.PENGUIN_FEATHER, 1]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 10,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.AMETHYST_ARROW] = {
    r: [
        [item_type_1.ItemType.AMETHYST, 10],
        [item_type_1.ItemType.VULTURE_FEATHER, 1]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 15,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.REIDITE_ARROW] = {
    r: [
        [item_type_1.ItemType.REIDITE, 10],
        [item_type_1.ItemType.VULTURE_FEATHER, 1],
        [item_type_1.ItemType.FLAME, 1]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 15,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.DRAGON_ARROW] = {
    r: [
        [item_type_1.ItemType.EMERALD, 10],
        [item_type_1.ItemType.SANDWORM_JUICE, 1]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 20,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.WOOD_SHIELD] = {
    r: [
        [item_type_1.ItemType.WOOD, 100]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 25,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.STONE_SHIELD] = {
    r: [
        [item_type_1.ItemType.WOOD_SHIELD, 1],
        [item_type_1.ItemType.STONE, 100],
        [item_type_1.ItemType.WOOD, 50]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 40,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.GOLD_SHIELD] = {
    r: [
        [item_type_1.ItemType.STONE_SHIELD, 1],
        [item_type_1.ItemType.GOLD, 50],
        [item_type_1.ItemType.STONE, 50],
        [item_type_1.ItemType.WOOD, 50]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 50,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.DIAMOND_SHIELD] = {
    r: [
        [item_type_1.ItemType.GOLD_SHIELD, 1],
        [item_type_1.ItemType.DIAMOND, 50],
        [item_type_1.ItemType.GOLD, 50],
        [item_type_1.ItemType.STONE, 50]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 70,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.AMETHYST_SHIELD] = {
    r: [
        [item_type_1.ItemType.DIAMOND_SHIELD, 1],
        [item_type_1.ItemType.AMETHYST, 50],
        [item_type_1.ItemType.DIAMOND, 50],
        [item_type_1.ItemType.GOLD, 50]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 90,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.REIDITE_SHIELD] = {
    r: [
        [item_type_1.ItemType.AMETHYST_SHIELD, 1],
        [item_type_1.ItemType.REIDITE, 50],
        [item_type_1.ItemType.AMETHYST, 50],
        [item_type_1.ItemType.DIAMOND, 50]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 120,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.WOOD_PICK] = {
    r: [
        [item_type_1.ItemType.WOOD, 10]
    ],
    f: 0,
    e: 0,
    w: 0,
    o: 0,
    time: 3,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.STONE_PICK] = {
    r: [
        [item_type_1.ItemType.WOOD_PICK, 1],
        [item_type_1.ItemType.WOOD, 50],
        [item_type_1.ItemType.STONE, 15]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 8,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.GOLD_PICK] = {
    r: [
        [item_type_1.ItemType.WOOD, 40],
        [item_type_1.ItemType.GOLD, 20],
        [item_type_1.ItemType.STONE, 30],
        [item_type_1.ItemType.STONE_PICK, 1]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 12,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.DIAMOND_PICK] = {
    r: [
        [item_type_1.ItemType.DIAMOND, 20],
        [item_type_1.ItemType.GOLD, 50],
        [item_type_1.ItemType.STONE, 80],
        [item_type_1.ItemType.GOLD_PICK, 1]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 20,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.AMETHYST_PICK] = {
    r: [
        [item_type_1.ItemType.DIAMOND, 40],
        [item_type_1.ItemType.GOLD, 60],
        [item_type_1.ItemType.AMETHYST, 30],
        [item_type_1.ItemType.DIAMOND_PICK, 1]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 60,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.REIDITE_PICK] = {
    r: [
        [item_type_1.ItemType.AMETHYST, 30],
        [item_type_1.ItemType.DIAMOND, 40],
        [item_type_1.ItemType.REIDITE, 30],
        [item_type_1.ItemType.AMETHYST_PICK, 1]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 90,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.STONE_SHOVEL] = {
    r: [
        [item_type_1.ItemType.WOOD, 30],
        [item_type_1.ItemType.STONE, 15]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 5,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.GOLD_SHOVEL] = {
    r: [
        [item_type_1.ItemType.STONE_SHOVEL, 1],
        [item_type_1.ItemType.GOLD, 20],
        [item_type_1.ItemType.STONE, 30],
        [item_type_1.ItemType.WOOD, 40]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 10,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.DIAMOND_SHOVEL] = {
    r: [
        [item_type_1.ItemType.GOLD_SHOVEL, 1],
        [item_type_1.ItemType.DIAMOND, 20],
        [item_type_1.ItemType.GOLD, 50],
        [item_type_1.ItemType.STONE, 80]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 20,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.AMETHYST_SHOVEL] = {
    r: [
        [item_type_1.ItemType.DIAMOND_SHOVEL, 1],
        [item_type_1.ItemType.GOLD, 60],
        [item_type_1.ItemType.AMETHYST, 30],
        [item_type_1.ItemType.DIAMOND, 40]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 40,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.WOOD_HELMET] = {
    r: [
        [item_type_1.ItemType.WOOD, 50]
    ],
    f: 0,
    e: 0,
    w: 0,
    o: 0,
    time: 5,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.STONE_HELMET] = {
    r: [
        [item_type_1.ItemType.STONE, 75],
        [item_type_1.ItemType.WOOD, 75],
        [item_type_1.ItemType.WOOD_HELMET, 1]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 10,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.GOLD_HELMET] = {
    r: [
        [item_type_1.ItemType.STONE, 90],
        [item_type_1.ItemType.WOOD, 90],
        [item_type_1.ItemType.GOLD, 90],
        [item_type_1.ItemType.STONE_HELMET, 1]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 20,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.DIAMOND_HELMET] = {
    r: [
        [item_type_1.ItemType.STONE, 100],
        [item_type_1.ItemType.GOLD, 100],
        [item_type_1.ItemType.DIAMOND, 100],
        [item_type_1.ItemType.GOLD_HELMET, 1]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 30,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.AMETHYST_HELMET] = {
    r: [
        [item_type_1.ItemType.AMETHYST, 80],
        [item_type_1.ItemType.GOLD, 150],
        [item_type_1.ItemType.DIAMOND, 120],
        [item_type_1.ItemType.DIAMOND_HELMET, 1]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 60,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.REIDITE_HELMET] = {
    r: [
        [item_type_1.ItemType.REIDITE, 80],
        [item_type_1.ItemType.DIAMOND, 150],
        [item_type_1.ItemType.AMETHYST, 120],
        [item_type_1.ItemType.AMETHYST_HELMET, 1]
    ],
    f: 1,
    e: 0,
    w: 1,
    o: 0,
    time: 90,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.DRAGON_HELMET] = {
    r: [
        [item_type_1.ItemType.DIAMOND_CORD, 30],
        [item_type_1.ItemType.DRAGON_CUBE, 1],
        [item_type_1.ItemType.AMETHYST, 150],
        [item_type_1.ItemType.DRAGON_HEART, 3]
    ],
    f: 1,
    e: 0,
    w: 1,
    o: 1,
    time: 120,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.LAVA_HELMET] = {
    r: [
        [item_type_1.ItemType.DRAGON_HELMET, 1],
        [item_type_1.ItemType.LAVA_CUBE, 1],
        [item_type_1.ItemType.REIDITE, 150],
        [item_type_1.ItemType.LAVA_HEART, 2]
    ],
    f: 1,
    e: 0,
    w: 1,
    o: 1,
    time: 180,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.CRAB_HELMET] = {
    r: [
        [item_type_1.ItemType.GOLD_HELMET, 1],
        [item_type_1.ItemType.CRAB_LOOT, 10],
        [item_type_1.ItemType.CRAB_STICK, 10],
        [item_type_1.ItemType.CORD, 10]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 60,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.DIAMOND_PROTECTION] = {
    r: [
        [item_type_1.ItemType.FLAME, 5],
        [item_type_1.ItemType.DIAMOND, 50],
        [item_type_1.ItemType.DIAMOND_CORD, 5]
    ],
    f: 1,
    e: 0,
    w: 1,
    o: 0,
    time: 20,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.AMETHYST_PROTECTION] = {
    r: [
        [item_type_1.ItemType.DIAMOND_PROTECTION, 1],
        [item_type_1.ItemType.FLAME, 10],
        [item_type_1.ItemType.AMETHYST, 50]
    ],
    f: 1,
    e: 0,
    w: 1,
    o: 0,
    time: 60,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.REIDITE_PROTECTION] = {
    r: [
        [item_type_1.ItemType.AMETHYST_PROTECTION, 1],
        [item_type_1.ItemType.FLAME, 15],
        [item_type_1.ItemType.AMETHYST, 50],
        [item_type_1.ItemType.REIDITE, 50]
    ],
    f: 1,
    e: 0,
    w: 1,
    o: 0,
    time: 90,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.SUPER_DIVING_SUIT] = {
    r: [
        [item_type_1.ItemType.DIVING_MASK, 1],
        [item_type_1.ItemType.GOLD, 80],
        [item_type_1.ItemType.KRAKEN_FUR, 1],
        [item_type_1.ItemType.AMETHYST, 20]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 90,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.DIVING_MASK] = {
    r: [
        [item_type_1.ItemType.PIRANHA_SCALES, 2],
        [item_type_1.ItemType.DIAMOND, 40],
        [item_type_1.ItemType.CORD, 4]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 20,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.STONE_HAMMER] = {
    r: [
        [item_type_1.ItemType.WOOD, 90],
        [item_type_1.ItemType.STONE, 50]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 10,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.GOLD_HAMMER] = {
    r: [
        [item_type_1.ItemType.WOOD, 160],
        [item_type_1.ItemType.STONE, 120],
        [item_type_1.ItemType.GOLD, 80],
        [item_type_1.ItemType.STONE_HAMMER, 1]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 15,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.DIAMOND_HAMMER] = {
    r: [
        [item_type_1.ItemType.DIAMOND, 80],
        [item_type_1.ItemType.STONE, 200],
        [item_type_1.ItemType.GOLD, 150],
        [item_type_1.ItemType.GOLD_HAMMER, 1]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 20,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.AMETHYST_HAMMER] = {
    r: [
        [item_type_1.ItemType.DIAMOND, 160],
        [item_type_1.ItemType.AMETHYST, 60],
        [item_type_1.ItemType.GOLD, 250],
        [item_type_1.ItemType.DIAMOND_HAMMER, 1]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 60,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.REIDITE_HAMMER] = {
    r: [
        [item_type_1.ItemType.AMETHYST, 160],
        [item_type_1.ItemType.REIDITE, 60],
        [item_type_1.ItemType.DIAMOND, 250],
        [item_type_1.ItemType.AMETHYST_HAMMER, 1]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 90,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.SUPER_HAMMER] = {
    r: [
        [item_type_1.ItemType.REIDITE_HAMMER, 1],
        [item_type_1.ItemType.BOTTLE_FULL, 1],
        [item_type_1.ItemType.KRAKEN_FUR, 1],
        [item_type_1.ItemType.PIRANHA_SCALES, 10],
        [item_type_1.ItemType.AMETHYST, 20]
    ],
    f: 1,
    e: 0,
    w: 1,
    o: 0,
    time: 120,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.CROWN_GREEN] = {
    r: [
        [item_type_1.ItemType.GEM_GREEN, 1],
        [item_type_1.ItemType.GOLD, 200]
    ],
    f: 1,
    e: 0,
    w: 1,
    o: 1,
    time: 60,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.CROWN_ORANGE] = {
    r: [
        [item_type_1.ItemType.GEM_ORANGE, 1],
        [item_type_1.ItemType.GOLD, 200]
    ],
    f: 1,
    e: 0,
    w: 1,
    o: 1,
    time: 60,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.CROWN_BLUE] = {
    r: [
        [item_type_1.ItemType.GEM_BLUE, 1],
        [item_type_1.ItemType.GOLD, 200],
        [item_type_1.ItemType.DRAGON_HEART, 1]
    ],
    f: 1,
    e: 0,
    w: 1,
    o: 1,
    time: 60,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.FIRE] = {
    r: [
        [item_type_1.ItemType.WOOD, 25],
        [item_type_1.ItemType.STONE, 5]
    ],
    f: 0,
    e: 0,
    w: 0,
    o: 0,
    time: 5,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.BIG_FIRE] = {
    r: [
        [item_type_1.ItemType.FIRE, 1],
        [item_type_1.ItemType.WOOD, 35],
        [item_type_1.ItemType.STONE, 10]
    ],
    f: 0,
    e: 0,
    w: 0,
    o: 0,
    time: 5,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.FURNACE] = {
    r: [
        [item_type_1.ItemType.WOOD, 150],
        [item_type_1.ItemType.STONE, 50],
        [item_type_1.ItemType.GOLD, 15]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 20,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.WORKBENCH] = {
    r: [
        [item_type_1.ItemType.WOOD, 20],
        [item_type_1.ItemType.STONE, 10]
    ],
    f: 0,
    e: 0,
    w: 0,
    o: 0,
    time: 6,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.PAPER] = {
    r: [
        [item_type_1.ItemType.WOOD, 20]
    ],
    f: 1,
    e: 0,
    w: 0,
    o: 0,
    time: 3,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.STONE_EXTRACTOR] = {
    r: [
        [item_type_1.ItemType.WOOD, 50],
        [item_type_1.ItemType.STONE, 100]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 90,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.GOLD_EXTRACTOR] = {
    r: [
        [item_type_1.ItemType.STONE, 60],
        [item_type_1.ItemType.GOLD, 120]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 90,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.DIAMOND_EXTRACTOR] = {
    r: [
        [item_type_1.ItemType.GOLD, 70],
        [item_type_1.ItemType.DIAMOND, 140]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 90,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.AMETHYST_EXTRACTOR] = {
    r: [
        [item_type_1.ItemType.DIAMOND, 80],
        [item_type_1.ItemType.AMETHYST, 160]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 90,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.REIDITE_EXTRACTOR] = {
    r: [
        [item_type_1.ItemType.AMETHYST, 90],
        [item_type_1.ItemType.REIDITE, 180]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 90,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.EARMUFFS] = {
    r: [
        [item_type_1.ItemType.RABBIT_FUR, 1],
        [item_type_1.ItemType.CORD, 2]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 5,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.COAT] = {
    r: [
        [item_type_1.ItemType.EARMUFFS, 1],
        [item_type_1.ItemType.WOLF_FUR, 5],
        [item_type_1.ItemType.CORD, 4]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 12,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.CAP_SCARF] = {
    r: [
        [item_type_1.ItemType.COAT, 1],
        [item_type_1.ItemType.WINTER_FUR, 5],
        [item_type_1.ItemType.DIAMOND_CORD, 4]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 30,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.FUR_HAT] = {
    r: [
        [item_type_1.ItemType.CAP_SCARF, 1],
        [item_type_1.ItemType.WINTER_FUR, 5],
        [item_type_1.ItemType.MAMMOTH_FUR, 10],
        [item_type_1.ItemType.DIAMOND_CORD, 4]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 50,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.HOOD] = {
    r: [
        [item_type_1.ItemType.WOLF_FUR, 10],
        [item_type_1.ItemType.RABBIT_FUR, 5],
        [item_type_1.ItemType.CORD, 6]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 10,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.PEASANT] = {
    r: [
        [item_type_1.ItemType.RABBIT_FUR, 3],
        [item_type_1.ItemType.CORD, 2]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 10,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.WINTER_HOOD] = {
    r: [
        [item_type_1.ItemType.HOOD, 1],
        [item_type_1.ItemType.WINTER_HOOD_FUR, 1],
        [item_type_1.ItemType.WINTER_FUR, 15],
        [item_type_1.ItemType.DIAMOND_CORD, 5],
        [item_type_1.ItemType.PENGUIN_FEATHER, 8]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 60,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.WINTER_PEASANT] = {
    r: [
        [item_type_1.ItemType.PEASANT, 1],
        [item_type_1.ItemType.WINTER_PEASANT_FUR, 1],
        [item_type_1.ItemType.WINTER_FUR, 10],
        [item_type_1.ItemType.DIAMOND_CORD, 5],
        [item_type_1.ItemType.PENGUIN_FEATHER, 8]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 60,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.PILOT_HAT] = {
    r: [
        [item_type_1.ItemType.PILOT_GLASSES, 1],
        [item_type_1.ItemType.HAWK_FEATHER, 8],
        [item_type_1.ItemType.VULTURE_FEATHER, 8],
        [item_type_1.ItemType.PENGUIN_FEATHER, 8],
        [item_type_1.ItemType.CORD, 6]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 60,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.TURBAN1] = {
    r: [
        [item_type_1.ItemType.CORD, 4],
        [item_type_1.ItemType.BOAR_FUR, 2]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 15,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.TURBAN2] = {
    r: [
        [item_type_1.ItemType.TURBAN1, 1],
        [item_type_1.ItemType.CORD, 6],
        [item_type_1.ItemType.BOAR_FUR, 4],
        [item_type_1.ItemType.VULTURE_FEATHER, 12],
        [item_type_1.ItemType.PENGUIN_FEATHER, 4]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 150,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.BOOK] = {
    r: [
        [item_type_1.ItemType.PAPER, 4],
        [item_type_1.ItemType.CORD, 4],
        [item_type_1.ItemType.WOLF_FUR, 4]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 15,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.BAG] = {
    r: [
        [item_type_1.ItemType.CORD, 6],
        [item_type_1.ItemType.WOLF_FUR, 5]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 15,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.EXPLORER_HAT] = {
    r: [
        [item_type_1.ItemType.PAPER, 1],
        [item_type_1.ItemType.RABBIT_FUR, 1],
        [item_type_1.ItemType.CORD, 2]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 5,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.PIRATE_HAT] = {
    r: [
        [item_type_1.ItemType.PAPER, 5],
        [item_type_1.ItemType.PENGUIN_FEATHER, 20],
        [item_type_1.ItemType.DIAMOND_CORD, 5],
        [item_type_1.ItemType.RABBIT_FUR, 5]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 30,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.PITCHFORK] = {
    r: [
        [item_type_1.ItemType.WOOD, 100],
        [item_type_1.ItemType.STONE, 50]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 10,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.GOLD_PITCHFORK] = {
    r: [
        [item_type_1.ItemType.PITCHFORK, 1],
        [item_type_1.ItemType.PITCHFORK_PART, 1]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 60,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.WRENCH] = {
    r: [
        [item_type_1.ItemType.STONE, 70]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 10,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.MACHETE] = {
    r: [
        [item_type_1.ItemType.STONE, 70],
        [item_type_1.ItemType.WOOD, 50]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 10,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.WATERING_CAN_EMPTY] = {
    r: [
        [item_type_1.ItemType.WOOD, 40]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 8,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.WATERING_CAN_FULL] = {
    r: [
        [item_type_1.ItemType.WATERING_CAN_EMPTY, 1]
    ],
    f: 0,
    e: 0,
    w: 0,
    o: 1,
    time: 5,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.BRIDGE] = {
    r: [
        [item_type_1.ItemType.WOOD, 15]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 5,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.TOWER] = {
    r: [
        [item_type_1.ItemType.WOOD, 120]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 15,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.SADDLE] = {
    r: [
        [item_type_1.ItemType.CORD, 10],
        [item_type_1.ItemType.WOLF_FUR, 6],
        [item_type_1.ItemType.RABBIT_FUR, 4],
        [item_type_1.ItemType.SAND, 50]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 20,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.WINDMILL] = {
    r: [
        [item_type_1.ItemType.WOOD, 60],
        [item_type_1.ItemType.STONE, 20],
        [item_type_1.ItemType.CORD, 2]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 10,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.PLOT] = {
    r: [
        [item_type_1.ItemType.WOOD, 20],
        [item_type_1.ItemType.GROUND, 15]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 5,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.BREAD_OVEN] = {
    r: [
        [item_type_1.ItemType.WOOD, 40],
        [item_type_1.ItemType.STONE, 40]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 10,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.DIAMOND_CORD] = {
    r: [
        [item_type_1.ItemType.DIAMOND, 1],
        [item_type_1.ItemType.CORD, 1]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 3,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.RESURRECTION] = {
    r: [
        [item_type_1.ItemType.DIAMOND, 40],
        [item_type_1.ItemType.STONE, 45]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 20,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.EMERALD_MACHINE] = {
    r: [
        [item_type_1.ItemType.RESURRECTION, 1],
        [item_type_1.ItemType.EMERALD, 40],
        [item_type_1.ItemType.SANDWORM_JUICE, 1]
    ],
    f: 1,
    e: 0,
    w: 1,
    o: 1,
    time: 200,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.LOCK_PICK] = {
    r: [
        [item_type_1.ItemType.GOLD, 250]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 60,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.LOCK] = {
    r: [
        [item_type_1.ItemType.GOLD, 10]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 5,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.TOTEM] = {
    r: [
        [item_type_1.ItemType.WOOD, 50]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 10,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.CHEST] = {
    r: [
        [item_type_1.ItemType.WOOD, 25],
        [item_type_1.ItemType.GOLD, 2]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 5,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.WELL] = {
    r: [
        [item_type_1.ItemType.STONE, 100],
        [item_type_1.ItemType.GROUND, 30]
    ],
    f: 1,
    e: 0,
    w: 1,
    o: 0,
    time: 10,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.BANDAGE] = {
    r: [
        [item_type_1.ItemType.CORD, 2]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 5,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.ROOF] = {
    r: [
        [item_type_1.ItemType.WOOD, 30]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 5,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.BED] = {
    r: [
        [item_type_1.ItemType.WOOD, 100],
        [item_type_1.ItemType.STONE, 50],
        [item_type_1.ItemType.RABBIT_FUR, 5],
        [item_type_1.ItemType.WOLF_FUR, 5],
        [item_type_1.ItemType.CORD, 6]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 20,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.BOAT] = {
    r: [
        [item_type_1.ItemType.WOOD, 250],
        [item_type_1.ItemType.DIAMOND_CORD, 10],
        [item_type_1.ItemType.WINTER_FUR, 2],
        [item_type_1.ItemType.PIRANHA_SCALES, 2]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 50,
    bonus: 1000
};
exports.RECIPES[item_type_1.ItemType.SLED] = {
    r: [
        [item_type_1.ItemType.WOOD, 250],
        [item_type_1.ItemType.CORD, 10],
        [item_type_1.ItemType.WINTER_FUR, 2],
        [item_type_1.ItemType.PENGUIN_FEATHER, 8]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 50,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.PLANE] = {
    r: [
        [item_type_1.ItemType.WOOD, 250],
        [item_type_1.ItemType.CORD, 10],
        [item_type_1.ItemType.PAPER, 10],
        [item_type_1.ItemType.HAWK_FEATHER, 8]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 50,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.BERRY_SEED] = {
    r: [
        [item_type_1.ItemType.BERRY, 3]
    ],
    f: 1,
    e: 0,
    w: 0,
    o: 0,
    time: 5,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.WHEAT_SEED] = {
    r: [
        [item_type_1.ItemType.WHEAT, 3]
    ],
    f: 1,
    e: 0,
    w: 0,
    o: 0,
    time: 5,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.PUMPKIN_SEED] = {
    r: [
        [item_type_1.ItemType.PUMPKIN, 8]
    ],
    f: 1,
    e: 0,
    w: 0,
    o: 0,
    time: 5,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.CARROT_SEED] = {
    r: [
        [item_type_1.ItemType.CARROT, 8]
    ],
    f: 1,
    e: 0,
    w: 0,
    o: 0,
    time: 5,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.TOMATO_SEED] = {
    r: [
        [item_type_1.ItemType.TOMATO, 8]
    ],
    f: 1,
    e: 0,
    w: 0,
    o: 0,
    time: 5,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.THORNBUSH_SEED] = {
    r: [
        [item_type_1.ItemType.THORNBUSH, 8]
    ],
    f: 1,
    e: 0,
    w: 0,
    o: 0,
    time: 5,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.GARLIC_SEED] = {
    r: [
        [item_type_1.ItemType.GARLIC, 8]
    ],
    f: 1,
    e: 0,
    w: 0,
    o: 0,
    time: 5,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.WATERMELON_SEED] = {
    r: [
        [item_type_1.ItemType.WATERMELON, 16]
    ],
    f: 1,
    e: 0,
    w: 0,
    o: 0,
    time: 5,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.ALOE_VERA_SEED] = {
    r: [
        [item_type_1.ItemType.ALOE_VERA, 16]
    ],
    f: 1,
    e: 0,
    w: 0,
    o: 0,
    time: 5,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.BREAD] = {
    r: [
        [item_type_1.ItemType.FLOUR, 3]
    ],
    f: 1,
    e: 0,
    w: 0,
    o: 0,
    time: 3,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.SANDWICH] = {
    r: [
        [item_type_1.ItemType.BREAD, 1],
        [item_type_1.ItemType.COOKED_MEAT, 1]
    ],
    f: 0,
    e: 0,
    w: 0,
    o: 0,
    time: 3,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.BOTTLE_FULL] = {
    r: [
        [item_type_1.ItemType.BOTTLE_EMPTY, 1]
    ],
    f: 0,
    e: 1,
    w: 0,
    o: 0,
    time: 3,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.BOTTLE_FULL_2] = {
    r: [
        [item_type_1.ItemType.BOTTLE_EMPTY, 1],
        [item_type_1.ItemType.ICE, 20]
    ],
    f: 1,
    e: 0,
    w: 0,
    o: 0,
    time: 3,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.BOTTLE_FULL_3] = {
    r: [
        [item_type_1.ItemType.BOTTLE_EMPTY, 1],
    ],
    f: 0,
    e: 0,
    w: 0,
    o: 1,
    time: 3,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.BOTTLE_EMPTY] = {
    r: [
        [item_type_1.ItemType.SAND, 25]
    ],
    f: 1,
    e: 0,
    w: 1,
    o: 0,
    time: 5,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.COOKIE] = {
    r: [
        [item_type_1.ItemType.FLOUR, 3],
        [item_type_1.ItemType.BERRY, 1]
    ],
    f: 1,
    e: 0,
    w: 0,
    o: 0,
    time: 3,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.CAKE] = {
    r: [
        [item_type_1.ItemType.FLOUR, 5],
        [item_type_1.ItemType.BERRY, 2],
        [item_type_1.ItemType.ICE, 2]
    ],
    f: 1,
    e: 0,
    w: 0,
    o: 0,
    time: 5,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.FISH_COOKED] = {
    r: [
        [item_type_1.ItemType.FISH, 1]
    ],
    f: 1,
    e: 0,
    w: 0,
    o: 0,
    time: 3,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.COOKED_MEAT] = {
    r: [
        [item_type_1.ItemType.MEAT, 1]
    ],
    f: 1,
    e: 0,
    w: 0,
    o: 0,
    time: 5,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.BUCKET_FULL] = {
    r: [
        [item_type_1.ItemType.BUCKET_EMPTY, 1]
    ],
    f: 0,
    e: 0,
    w: 0,
    o: 1,
    time: 5,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.BUCKET_EMPTY] = {
    r: [
        [item_type_1.ItemType.WOOD, 20],
        [item_type_1.ItemType.CORD, 1]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 5,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.WOOD_WALL] = {
    r: [
        [item_type_1.ItemType.WOOD, 20]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 5,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.STONE_WALL] = {
    r: [
        [item_type_1.ItemType.WOOD_WALL, 1],
        [item_type_1.ItemType.STONE, 17]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 5,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.GOLD_WALL] = {
    r: [
        [item_type_1.ItemType.STONE_WALL, 1],
        [item_type_1.ItemType.GOLD, 14]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 5,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.DIAMOND_WALL] = {
    r: [
        [item_type_1.ItemType.GOLD_WALL, 1],
        [item_type_1.ItemType.DIAMOND, 11]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 5,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.AMETHYST_WALL] = {
    r: [
        [item_type_1.ItemType.DIAMOND_WALL, 1],
        [item_type_1.ItemType.AMETHYST, 8]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 5,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.REIDITE_WALL] = {
    r: [
        [item_type_1.ItemType.AMETHYST_WALL, 1],
        [item_type_1.ItemType.REIDITE, 5]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 5,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.WOOD_SPIKE] = {
    r: [
        [item_type_1.ItemType.WOOD_WALL, 1],
        [item_type_1.ItemType.WOOD, 40],
        [item_type_1.ItemType.STONE, 30]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 20,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.STONE_SPIKE] = {
    r: [
        [item_type_1.ItemType.STONE_WALL, 1],
        [item_type_1.ItemType.STONE, 70]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 20,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.GOLD_SPIKE] = {
    r: [
        [item_type_1.ItemType.GOLD_WALL, 1],
        [item_type_1.ItemType.GOLD, 40],
        [item_type_1.ItemType.STONE, 30]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 20,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.DIAMOND_SPIKE] = {
    r: [
        [item_type_1.ItemType.DIAMOND_WALL, 1],
        [item_type_1.ItemType.DIAMOND, 40],
        [item_type_1.ItemType.STONE, 30]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 20,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.AMETHYST_SPIKE] = {
    r: [
        [item_type_1.ItemType.AMETHYST_WALL, 1],
        [item_type_1.ItemType.AMETHYST, 40],
        [item_type_1.ItemType.STONE, 30]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 20,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.REIDITE_SPIKE] = {
    r: [
        [item_type_1.ItemType.REIDITE_WALL, 1],
        [item_type_1.ItemType.REIDITE, 40],
        [item_type_1.ItemType.GOLD, 30]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 20,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.WOOD_DOOR] = {
    r: [
        [item_type_1.ItemType.WOOD, 30]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 8,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.STONE_DOOR] = {
    r: [
        [item_type_1.ItemType.WOOD_DOOR, 1],
        [item_type_1.ItemType.STONE, 27]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 8,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.GOLD_DOOR] = {
    r: [
        [item_type_1.ItemType.STONE_DOOR, 1],
        [item_type_1.ItemType.GOLD, 24]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 8,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.DIAMOND_DOOR] = {
    r: [
        [item_type_1.ItemType.GOLD_DOOR, 1],
        [item_type_1.ItemType.DIAMOND, 21]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 8,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.AMETHYST_DOOR] = {
    r: [
        [item_type_1.ItemType.DIAMOND_DOOR, 1],
        [item_type_1.ItemType.AMETHYST, 18]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 8,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.REIDITE_DOOR] = {
    r: [
        [item_type_1.ItemType.AMETHYST_DOOR, 1],
        [item_type_1.ItemType.REIDITE, 15]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 8,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.WOOD_DOOR_SPIKE] = {
    r: [
        [item_type_1.ItemType.WOOD_DOOR, 1],
        [item_type_1.ItemType.WOOD, 80],
        [item_type_1.ItemType.STONE, 60]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 20,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.STONE_DOOR_SPIKE] = {
    r: [
        [item_type_1.ItemType.STONE_DOOR, 1],
        [item_type_1.ItemType.STONE, 140]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 20,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.GOLD_DOOR_SPIKE] = {
    r: [
        [item_type_1.ItemType.GOLD_DOOR, 1],
        [item_type_1.ItemType.GOLD, 80],
        [item_type_1.ItemType.STONE, 60]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 20,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.DIAMOND_DOOR_SPIKE] = {
    r: [
        [item_type_1.ItemType.DIAMOND_DOOR, 1],
        [item_type_1.ItemType.DIAMOND, 80],
        [item_type_1.ItemType.STONE, 60]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 20,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.AMETHYST_DOOR_SPIKE] = {
    r: [
        [item_type_1.ItemType.AMETHYST_DOOR, 1],
        [item_type_1.ItemType.AMETHYST, 80],
        [item_type_1.ItemType.STONE, 60]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 20,
    bonus: 0
};
exports.RECIPES[item_type_1.ItemType.REIDITE_DOOR_SPIKE] = {
    r: [
        [item_type_1.ItemType.REIDITE_DOOR, 1],
        [item_type_1.ItemType.REIDITE, 80],
        [item_type_1.ItemType.GOLD, 60]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 20,
    bonus: 0
};
