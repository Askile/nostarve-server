import {ItemType} from "../enums/types/item.type";

export const RECIPES = [] as Recipe[];

RECIPES[ItemType.WOOD_SWORD] = {
    r: [
        [ItemType.WOOD, 30]
    ],
    f: 0,
    e: 0,
    w: 0,
    o: 0,
    time: 5,
    bonus: 0
}

RECIPES[ItemType.STONE_SWORD] = {
    r: [
        [ItemType.WOOD, 50],
        [ItemType.STONE, 25],
        [ItemType.WOOD_SWORD, 1]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 10,
    bonus: 0
}

RECIPES[ItemType.GOLD_SWORD] = {
    r: [
        [ItemType.WOOD, 60],
        [ItemType.GOLD, 40],
        [ItemType.STONE, 50],
        [ItemType.STONE_SWORD, 1]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 20,
    bonus: 0
}

RECIPES[ItemType.DIAMOND_SWORD] = {
    r: [
        [ItemType.DIAMOND, 40],
        [ItemType.GOLD, 60],
        [ItemType.STONE, 80],
        [ItemType.GOLD_SWORD, 1]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 30,
    bonus: 0
}

RECIPES[ItemType.AMETHYST_SWORD] ={
    r: [
        [ItemType.DIAMOND, 60],
        [ItemType.GOLD, 100],
        [ItemType.AMETHYST, 40],
        [ItemType.DIAMOND_SWORD, 1]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 60,
    bonus: 0
}

RECIPES[ItemType.REIDITE_SWORD] = {
    r: [
        [ItemType.DIAMOND, 100],
        [ItemType.AMETHYST, 80],
        [ItemType.REIDITE, 40],
        [ItemType.AMETHYST_SWORD, 1]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 90,
    bonus: 0
}

RECIPES[ItemType.DRAGON_SWORD] = {
    r: [
        [ItemType.DIAMOND_CORD, 20],
        [ItemType.DRAGON_ORB, 1],
        [ItemType.AMETHYST, 150],
        [ItemType.DRAGON_HEART, 3]
    ],
    f: 1,
    e: 0,
    w: 1,
    o: 1,
    time: 120,
    bonus: 0
}

RECIPES[ItemType.LAVA_SWORD] = {
    r: [
        [ItemType.DRAGON_SWORD, 1],
        [ItemType.LAVA_ORB, 1],
        [ItemType.REIDITE, 150],
        [ItemType.LAVA_HEART, 2]
    ],
    f: 1,
    e: 0,
    w: 1,
    o: 1,
    time: 180,
    bonus: 0
}

RECIPES[ItemType.WOOD_SPEAR] = {
    r: [
        [ItemType.WOOD, 40]
    ],
    f: 0,
    e: 0,
    w: 0,
    o: 0,
    time: 5,
    bonus: 0
}

RECIPES[ItemType.STONE_SPEAR] = {
    r: [
        [ItemType.WOOD_SPEAR, 1],
        [ItemType.WOOD, 60],
        [ItemType.STONE, 10]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 10,
    bonus: 0
}

RECIPES[ItemType.GOLD_SPEAR] = {
    r: [
        [ItemType.WOOD, 80],
        [ItemType.GOLD, 30],
        [ItemType.STONE, 30],
        [ItemType.STONE_SPEAR, 1]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 20,
    bonus: 0
}

RECIPES[ItemType.DIAMOND_SPEAR] = {
    r: [
        [ItemType.WOOD, 200],
        [ItemType.DIAMOND, 40],
        [ItemType.GOLD, 60],
        [ItemType.GOLD_SPEAR, 1]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 30,
    bonus: 0
}

RECIPES[ItemType.AMETHYST_SPEAR] = {
    r: [
        [ItemType.AMETHYST, 40],
        [ItemType.DIAMOND, 80],
        [ItemType.GOLD, 90],
        [ItemType.DIAMOND_SPEAR, 1]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 60,
    bonus: 0
}

RECIPES[ItemType.REIDITE_SPEAR] = {
    r: [
        [ItemType.REIDITE, 40],
        [ItemType.AMETHYST, 80],
        [ItemType.DIAMOND, 90],
        [ItemType.AMETHYST_SPEAR, 1]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 90,
    bonus: 0
}

RECIPES[ItemType.DRAGON_SPEAR] = {
    r: [
        [ItemType.DIAMOND_CORD, 20],
        [ItemType.DRAGON_ORB, 1],
        [ItemType.AMETHYST, 100],
        [ItemType.DRAGON_HEART, 3]
    ],
    f: 1,
    e: 0,
    w: 1,
    o: 1,
    time: 120,
    bonus: 0
}
RECIPES[ItemType.LAVA_SPEAR] = {
    r: [
        [ItemType.DRAGON_SPEAR, 1],
        [ItemType.LAVA_ORB, 1],
        [ItemType.REIDITE, 100],
        [ItemType.LAVA_HEART, 2]
    ],
    f: 1,
    e: 0,
    w: 1,
    o: 1,
    time: 200,
    bonus: 0
}
RECIPES[ItemType.CRAB_SPEAR] = {
    r: [
        [ItemType.WOOD_SPEAR, 1],
        [ItemType.CRAB_LOOT, 5],
        [ItemType.CORD, 6]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 30,
    bonus: 0
}
RECIPES[ItemType.WOOD_BOW] = {
    r: [
        [ItemType.WOOD, 100],
        [ItemType.CORD, 4]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 20,
    bonus: 0
}
RECIPES[ItemType.STONE_BOW] = {
    r: [
        [ItemType.STONE, 200],
        [ItemType.CORD, 8],
        [ItemType.PENGUIN_FEATHER, 4],
        [ItemType.WOOD_BOW, 1]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 25,
    bonus: 0
}
RECIPES[ItemType.GOLD_BOW] = {
    r: [
        [ItemType.GOLD, 200],
        [ItemType.CORD, 12],
        [ItemType.HAWK_FEATHER, 4],
        [ItemType.PENGUIN_FEATHER, 4],
        [ItemType.STONE_BOW, 1]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 30,
    bonus: 0
}

RECIPES[ItemType.DIAMOND_BOW] = {
    r: [
        [ItemType.DIAMOND, 200],
        [ItemType.DIAMOND_CORD, 10],
        [ItemType.HAWK_FEATHER, 8],
        [ItemType.PENGUIN_FEATHER, 8],
        [ItemType.GOLD_BOW, 1]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 35,
    bonus: 0
}
RECIPES[ItemType.AMETHYST_BOW] = {
    r: [
        [ItemType.AMETHYST, 200],
        [ItemType.DIAMOND_CORD, 10],
        [ItemType.PENGUIN_FEATHER, 8],
        [ItemType.VULTURE_FEATHER, 8],
        [ItemType.DIAMOND_BOW, 1]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 40,
    bonus: 0
}
RECIPES[ItemType.REIDITE_BOW] = {
    r: [
        [ItemType.REIDITE, 200],
        [ItemType.DIAMOND_CORD, 10],
        [ItemType.KRAKEN_FUR, 1],
        [ItemType.AMETHYST_BOW, 1]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 45,
    bonus: 0
}
RECIPES[ItemType.DRAGON_BOW] = {
    r: [
        [ItemType.EMERALD, 200],
        [ItemType.DIAMOND_CORD, 10],
        [ItemType.DRAGON_ORB, 1],
        [ItemType.REIDITE_BOW, 1]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 50,
    bonus: 0
}
RECIPES[ItemType.WOOD_ARROW] = {
    r: [
        [ItemType.WOOD, 30]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 5,
    bonus: 0
}
RECIPES[ItemType.STONE_ARROW] = {
    r: [
        [ItemType.STONE, 20],
        [ItemType.HAWK_FEATHER, 1]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 5,
    bonus: 0
}
RECIPES[ItemType.GOLD_ARROW] = {
    r: [
        [ItemType.GOLD, 20],
        [ItemType.PENGUIN_FEATHER, 1]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 10,
    bonus: 0
}
RECIPES[ItemType.DIAMOND_ARROW] = {
    r: [
        [ItemType.DIAMOND, 10],
        [ItemType.PENGUIN_FEATHER, 1]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 10,
    bonus: 0
}
RECIPES[ItemType.AMETHYST_ARROW] = {
    r: [
        [ItemType.AMETHYST, 10],
        [ItemType.VULTURE_FEATHER, 1]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 15,
    bonus: 0
}
RECIPES[ItemType.REIDITE_ARROW] = {
    r: [
        [ItemType.REIDITE, 10],
        [ItemType.VULTURE_FEATHER, 1],
        [ItemType.FLAME, 1]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 15,
    bonus: 0
}
RECIPES[ItemType.DRAGON_ARROW] = {
    r: [
        [ItemType.EMERALD, 10],
        [ItemType.SANDWORM_JUICE, 1]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 20,
    bonus: 0
}
RECIPES[ItemType.WOOD_SHIELD] = {
    r: [
        [ItemType.WOOD, 100]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 25,
    bonus: 0
}
RECIPES[ItemType.STONE_SHIELD] = {
    r: [
        [ItemType.WOOD_SHIELD, 1],
        [ItemType.STONE, 100],
        [ItemType.WOOD, 50]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 40,
    bonus: 0
}
RECIPES[ItemType.GOLD_SHIELD] = {
    r: [
        [ItemType.STONE_SHIELD, 1],
        [ItemType.GOLD, 50],
        [ItemType.STONE, 50],
        [ItemType.WOOD, 50]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 50,
    bonus: 0
}

RECIPES[ItemType.DIAMOND_SHIELD] = {
    r: [
        [ItemType.GOLD_SHIELD, 1],
        [ItemType.DIAMOND, 50],
        [ItemType.GOLD, 50],
        [ItemType.STONE, 50]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 70,
    bonus: 0
}

RECIPES[ItemType.AMETHYST_SHIELD] = {
    r: [
        [ItemType.DIAMOND_SHIELD, 1],
        [ItemType.AMETHYST, 50],
        [ItemType.DIAMOND, 50],
        [ItemType.GOLD, 50]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 90,
    bonus: 0
}

RECIPES[ItemType.REIDITE_SHIELD] = {
    r: [
        [ItemType.AMETHYST_SHIELD, 1],
        [ItemType.REIDITE, 50],
        [ItemType.AMETHYST, 50],
        [ItemType.DIAMOND, 50]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 120,
    bonus: 0
}

RECIPES[ItemType.WOOD_PICK] = {
    r: [
        [ItemType.WOOD, 10]
    ],
    f: 0,
    e: 0,
    w: 0,
    o: 0,
    time: 3,
    bonus: 0
}

RECIPES[ItemType.STONE_PICK] = {
    r: [
        [ItemType.WOOD_PICK, 1],
        [ItemType.WOOD, 50],
        [ItemType.STONE, 15]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 8,
    bonus: 0
}

RECIPES[ItemType.GOLD_PICK] = {
    r: [
        [ItemType.WOOD, 40],
        [ItemType.GOLD, 20],
        [ItemType.STONE, 30],
        [ItemType.STONE_PICK, 1]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 12,
    bonus: 0
}

RECIPES[ItemType.DIAMOND_PICK] = {
    r: [
        [ItemType.DIAMOND, 20],
        [ItemType.GOLD, 50],
        [ItemType.STONE, 80],
        [ItemType.GOLD_PICK, 1]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 20,
    bonus: 0
}

RECIPES[ItemType.AMETHYST_PICK] = {
    r: [
        [ItemType.DIAMOND, 40],
        [ItemType.GOLD, 60],
        [ItemType.AMETHYST, 30],
        [ItemType.DIAMOND_PICK, 1]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 60,
    bonus: 0
}

RECIPES[ItemType.REIDITE_PICK] = {
    r: [
        [ItemType.AMETHYST, 30],
        [ItemType.DIAMOND, 40],
        [ItemType.REIDITE, 30],
        [ItemType.AMETHYST_PICK, 1]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 90,
    bonus: 0
}

RECIPES[ItemType.STONE_SHOVEL] = {
    r: [
        [ItemType.WOOD, 30],
        [ItemType.STONE, 15]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 5,
    bonus: 0
}

RECIPES[ItemType.GOLD_SHOVEL] = {
    r: [
        [ItemType.STONE_SHOVEL, 1],
        [ItemType.GOLD, 20],
        [ItemType.STONE, 30],
        [ItemType.WOOD, 40]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 10,
    bonus: 0
}

RECIPES[ItemType.DIAMOND_SHOVEL] = {
    r: [
        [ItemType.GOLD_SHOVEL, 1],
        [ItemType.DIAMOND, 20],
        [ItemType.GOLD, 50],
        [ItemType.STONE, 80]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 20,
    bonus: 0
}

RECIPES[ItemType.AMETHYST_SHOVEL] = {
    r: [
        [ItemType.DIAMOND_SHOVEL, 1],
        [ItemType.GOLD, 60],
        [ItemType.AMETHYST, 30],
        [ItemType.DIAMOND, 40]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 40,
    bonus: 0
}

RECIPES[ItemType.WOOD_HELMET] = {
    r: [
        [ItemType.WOOD, 50]
    ],
    f: 0,
    e: 0,
    w: 0,
    o: 0,
    time: 5,
    bonus: 0
}

RECIPES[ItemType.STONE_HELMET] = {
    r: [
        [ItemType.STONE, 75],
        [ItemType.WOOD, 75],
        [ItemType.WOOD_HELMET, 1]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 10,
    bonus: 0
}

RECIPES[ItemType.GOLD_HELMET] = {
    r: [
        [ItemType.STONE, 90],
        [ItemType.WOOD, 90],
        [ItemType.GOLD, 90],
        [ItemType.STONE_HELMET, 1]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 20,
    bonus: 0
}

RECIPES[ItemType.DIAMOND_HELMET] = {
    r: [
        [ItemType.STONE, 100],
        [ItemType.GOLD, 100],
        [ItemType.DIAMOND, 100],
        [ItemType.GOLD_HELMET, 1]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 30,
    bonus: 0
}

RECIPES[ItemType.AMETHYST_HELMET] = {
    r: [
        [ItemType.AMETHYST, 80],
        [ItemType.GOLD, 150],
        [ItemType.DIAMOND, 120],
        [ItemType.DIAMOND_HELMET, 1]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 60,
    bonus: 0
}

RECIPES[ItemType.REIDITE_HELMET] = {
    r: [
        [ItemType.REIDITE, 80],
        [ItemType.DIAMOND, 150],
        [ItemType.AMETHYST, 120],
        [ItemType.AMETHYST_HELMET, 1]
    ],
    f: 1,
    e: 0,
    w: 1,
    o: 0,
    time: 90,
    bonus: 0
}

RECIPES[ItemType.DRAGON_HELMET] = {
    r: [
        [ItemType.DIAMOND_CORD, 30],
        [ItemType.DRAGON_CUBE, 1],
        [ItemType.AMETHYST, 150],
        [ItemType.DRAGON_HEART, 3]
    ],
    f: 1,
    e: 0,
    w: 1,
    o: 1,
    time: 120,
    bonus: 0
}

RECIPES[ItemType.LAVA_HELMET] = {
    r: [
        [ItemType.DRAGON_HELMET, 1],
        [ItemType.LAVA_CUBE, 1],
        [ItemType.REIDITE, 150],
        [ItemType.LAVA_HEART, 2]
    ],
    f: 1,
    e: 0,
    w: 1,
    o: 1,
    time: 180,
    bonus: 0
}

RECIPES[ItemType.CRAB_HELMET] = {
    r: [
        [ItemType.GOLD_HELMET, 1],
        [ItemType.CRAB_LOOT, 10],
        [ItemType.CRAB_STICK, 10],
        [ItemType.CORD, 10]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 60,
    bonus: 0
}

RECIPES[ItemType.DIAMOND_PROTECTION] = {
    r: [
        [ItemType.FLAME, 5],
        [ItemType.DIAMOND, 50],
        [ItemType.DIAMOND_CORD, 5]
    ],
    f: 1,
    e: 0,
    w: 1,
    o: 0,
    time: 20,
    bonus: 0
}
RECIPES[ItemType.AMETHYST_PROTECTION] = {
    r: [
        [ItemType.DIAMOND_PROTECTION, 1],
        [ItemType.FLAME, 10],
        [ItemType.AMETHYST, 50]
    ],
    f: 1,
    e: 0,
    w: 1,
    o: 0,
    time: 60,
    bonus: 0
}
RECIPES[ItemType.REIDITE_PROTECTION] = {
    r: [
        [ItemType.AMETHYST_PROTECTION, 1],
        [ItemType.FLAME, 15],
        [ItemType.AMETHYST, 50],
        [ItemType.REIDITE, 50]
    ],
    f: 1,
    e: 0,
    w: 1,
    o: 0,
    time: 90,
    bonus: 0
}
RECIPES[ItemType.SUPER_DIVING_SUIT] = {
    r: [
        [ItemType.DIVING_MASK, 1],
        [ItemType.GOLD, 80],
        [ItemType.KRAKEN_FUR, 1],
        [ItemType.AMETHYST, 20]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 90,
    bonus: 0
}
RECIPES[ItemType.DIVING_MASK] = {
    r: [
        [ItemType.PIRANHA_SCALES, 2],
        [ItemType.DIAMOND, 40],
        [ItemType.CORD, 4]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 20,
    bonus: 0
}
RECIPES[ItemType.STONE_HAMMER] = {
    r: [
        [ItemType.WOOD, 90],
        [ItemType.STONE, 50]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 10,
    bonus: 0
}
RECIPES[ItemType.GOLD_HAMMER] = {
    r: [
        [ItemType.WOOD, 160],
        [ItemType.STONE, 120],
        [ItemType.GOLD, 80],
        [ItemType.STONE_HAMMER, 1]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 15,
    bonus: 0
}
RECIPES[ItemType.DIAMOND_HAMMER] = {
    r: [
        [ItemType.DIAMOND, 80],
        [ItemType.STONE, 200],
        [ItemType.GOLD, 150],
        [ItemType.GOLD_HAMMER, 1]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 20,
    bonus: 0
}
RECIPES[ItemType.AMETHYST_HAMMER] = {
    r: [
        [ItemType.DIAMOND, 160],
        [ItemType.AMETHYST, 60],
        [ItemType.GOLD, 250],
        [ItemType.DIAMOND_HAMMER, 1]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 60,
    bonus: 0
}
RECIPES[ItemType.REIDITE_HAMMER] = {
    r: [
        [ItemType.AMETHYST, 160],
        [ItemType.REIDITE, 60],
        [ItemType.DIAMOND, 250],
        [ItemType.AMETHYST_HAMMER, 1]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 90,
    bonus: 0
}
RECIPES[ItemType.SUPER_HAMMER] = {
    r: [
        [ItemType.REIDITE_HAMMER, 1],
        [ItemType.BOTTLE_FULL, 1],
        [ItemType.KRAKEN_FUR, 1],
        [ItemType.PIRANHA_SCALES, 10],
        [ItemType.AMETHYST, 20]
    ],
    f: 1,
    e: 0,
    w: 1,
    o: 0,
    time: 120,
    bonus: 0
}
RECIPES[ItemType.CROWN_GREEN] = {
    r: [
        [ItemType.GEM_GREEN, 1],
        [ItemType.GOLD, 200]
    ],
    f: 1,
    e: 0,
    w: 1,
    o: 1,
    time: 60,
    bonus: 0
}
RECIPES[ItemType.CROWN_ORANGE] = {
    r: [
        [ItemType.GEM_ORANGE, 1],
        [ItemType.GOLD, 200]
    ],
    f: 1,
    e: 0,
    w: 1,
    o: 1,
    time: 60,
    bonus: 0
}
RECIPES[ItemType.CROWN_BLUE] = {
    r: [
        [ItemType.GEM_BLUE, 1],
        [ItemType.GOLD, 200],
        [ItemType.DRAGON_HEART, 1]
    ],
    f: 1,
    e: 0,
    w: 1,
    o: 1,
    time: 60,
    bonus: 0
}
RECIPES[ItemType.FIRE] = {
    r: [
        [ItemType.WOOD, 25],
        [ItemType.STONE, 5]
    ],
    f: 0,
    e: 0,
    w: 0,
    o: 0,
    time: 5,
    bonus: 0
}
RECIPES[ItemType.BIG_FIRE] = {
    r: [
        [ItemType.FIRE, 1],
        [ItemType.WOOD, 35],
        [ItemType.STONE, 10]
    ],
    f: 0,
    e: 0,
    w: 0,
    o: 0,
    time: 5,
    bonus: 0
}
RECIPES[ItemType.FURNACE] = {
    r: [
        [ItemType.WOOD, 150],
        [ItemType.STONE, 50],
        [ItemType.GOLD, 15]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 20,
    bonus: 0
}
RECIPES[ItemType.WORKBENCH] = {
    r: [
        [ItemType.WOOD, 20],
        [ItemType.STONE, 10]
    ],
    f: 0,
    e: 0,
    w: 0,
    o: 0,
    time: 6,
    bonus: 0
}
RECIPES[ItemType.PAPER] = {
    r: [
        [ItemType.WOOD, 20]
    ],
    f: 1,
    e: 0,
    w: 0,
    o: 0,
    time: 3,
    bonus: 0
}
RECIPES[ItemType.STONE_EXTRACTOR] = {
    r: [
        [ItemType.WOOD, 50],
        [ItemType.STONE, 100]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 90,
    bonus: 0
}
RECIPES[ItemType.GOLD_EXTRACTOR] = {
    r: [
        [ItemType.STONE, 60],
        [ItemType.GOLD, 120]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 90,
    bonus: 0
}
RECIPES[ItemType.DIAMOND_EXTRACTOR] = {
    r: [
        [ItemType.GOLD, 70],
        [ItemType.DIAMOND, 140]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 90,
    bonus: 0
}
RECIPES[ItemType.AMETHYST_EXTRACTOR] = {
    r: [
        [ItemType.DIAMOND, 80],
        [ItemType.AMETHYST, 160]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 90,
    bonus: 0
}
RECIPES[ItemType.REIDITE_EXTRACTOR] = {
    r: [
        [ItemType.AMETHYST, 90],
        [ItemType.REIDITE, 180]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 90,
    bonus: 0
}
RECIPES[ItemType.EARMUFFS] = {
    r: [
        [ItemType.RABBIT_FUR, 1],
        [ItemType.CORD, 2]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 5,
    bonus: 0
}
RECIPES[ItemType.COAT] = {
    r: [
        [ItemType.EARMUFFS, 1],
        [ItemType.WOLF_FUR, 5],
        [ItemType.CORD, 4]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 12,
    bonus: 0
}
RECIPES[ItemType.CAP_SCARF] = {
    r: [
        [ItemType.COAT, 1],
        [ItemType.WINTER_FUR, 5],
        [ItemType.DIAMOND_CORD, 4]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 30,
    bonus: 0
}
RECIPES[ItemType.FUR_HAT] = {
    r: [
        [ItemType.CAP_SCARF, 1],
        [ItemType.WINTER_FUR, 5],
        [ItemType.MAMMOTH_FUR, 10],
        [ItemType.DIAMOND_CORD, 4]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 50,
    bonus: 0
}
RECIPES[ItemType.HOOD] = {
    r: [
        [ItemType.WOLF_FUR, 10],
        [ItemType.RABBIT_FUR, 5],
        [ItemType.CORD, 6]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 10,
    bonus: 0
}
RECIPES[ItemType.PEASANT] = {
    r: [
        [ItemType.RABBIT_FUR, 3],
        [ItemType.CORD, 2]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 10,
    bonus: 0
}
RECIPES[ItemType.WINTER_HOOD] = {
    r: [
        [ItemType.HOOD, 1],
        [ItemType.WINTER_HOOD_FUR, 1],
        [ItemType.WINTER_FUR, 15],
        [ItemType.DIAMOND_CORD, 5],
        [ItemType.PENGUIN_FEATHER, 8]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 60,
    bonus: 0
}
RECIPES[ItemType.WINTER_PEASANT] = {
    r: [
        [ItemType.PEASANT, 1],
        [ItemType.WINTER_PEASANT_FUR, 1],
        [ItemType.WINTER_FUR, 10],
        [ItemType.DIAMOND_CORD, 5],
        [ItemType.PENGUIN_FEATHER, 8]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 60,
    bonus: 0
}
RECIPES[ItemType.PILOT_HAT] = {
    r: [
        [ItemType.PILOT_GLASSES, 1],
        [ItemType.HAWK_FEATHER, 8],
        [ItemType.VULTURE_FEATHER, 8],
        [ItemType.PENGUIN_FEATHER, 8],
        [ItemType.CORD, 6]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 60,
    bonus: 0
}
RECIPES[ItemType.TURBAN1] = {
    r: [
        [ItemType.CORD, 4],
        [ItemType.BOAR_FUR, 2]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 15,
    bonus: 0
}
RECIPES[ItemType.TURBAN2] = {
    r: [
        [ItemType.TURBAN1, 1],
        [ItemType.CORD, 6],
        [ItemType.BOAR_FUR, 4],
        [ItemType.VULTURE_FEATHER, 12],
        [ItemType.PENGUIN_FEATHER, 4]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 150,
    bonus: 0
}
RECIPES[ItemType.BOOK] = {
    r: [
        [ItemType.PAPER, 4],
        [ItemType.CORD, 4],
        [ItemType.WOLF_FUR, 4]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 15,
    bonus: 0
}
RECIPES[ItemType.BAG] = {
    r: [
        [ItemType.CORD, 6],
        [ItemType.WOLF_FUR, 5]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 15,
    bonus: 0
}
RECIPES[ItemType.EXPLORER_HAT] = {
    r: [
        [ItemType.PAPER, 1],
        [ItemType.RABBIT_FUR, 1],
        [ItemType.CORD, 2]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 5,
    bonus: 0
}
RECIPES[ItemType.PIRATE_HAT] = {
    r: [
        [ItemType.PAPER, 5],
        [ItemType.PENGUIN_FEATHER, 20],
        [ItemType.DIAMOND_CORD, 5],
        [ItemType.RABBIT_FUR, 5]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 30,
    bonus: 0
}
RECIPES[ItemType.PITCHFORK] = {
    r: [
        [ItemType.WOOD, 100],
        [ItemType.STONE, 50]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 10,
    bonus: 0
}
RECIPES[ItemType.GOLD_PITCHFORK] = {
    r: [
        [ItemType.PITCHFORK, 1],
        [ItemType.PITCHFORK_PART, 1]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 60,
    bonus: 0
}
RECIPES[ItemType.WRENCH] = {
    r: [
        [ItemType.STONE, 70]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 10,
    bonus: 0
}
RECIPES[ItemType.MACHETE] = {
    r: [
        [ItemType.STONE, 70],
        [ItemType.WOOD, 50]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 10,
    bonus: 0
}
RECIPES[ItemType.WATERING_CAN_EMPTY] = {
    r: [
        [ItemType.WOOD, 40]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 8,
    bonus: 0
}
RECIPES[ItemType.WATERING_CAN_FULL] = {
    r: [
        [ItemType.WATERING_CAN_EMPTY, 1]
    ],
    f: 0,
    e: 0,
    w: 0,
    o: 1,
    time: 5,
    bonus: 0
}
RECIPES[ItemType.BRIDGE] = {
    r: [
        [ItemType.WOOD, 15]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 5,
    bonus: 0
}
RECIPES[ItemType.TOWER] = {
    r: [
        [ItemType.WOOD, 120]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 15,
    bonus: 0
}
RECIPES[ItemType.SADDLE] = {
    r: [
        [ItemType.CORD, 10],
        [ItemType.WOLF_FUR, 6],
        [ItemType.RABBIT_FUR, 4],
        [ItemType.SAND, 50]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 20,
    bonus: 0
}
RECIPES[ItemType.WINDMILL] = {
    r: [
        [ItemType.WOOD, 60],
        [ItemType.STONE, 20],
        [ItemType.CORD, 2]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 10,
    bonus: 0
}
RECIPES[ItemType.PLOT] = {
    r: [
        [ItemType.WOOD, 20],
        [ItemType.GROUND, 15]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 5,
    bonus: 0
}
RECIPES[ItemType.BREAD_OVEN] = {
    r: [
        [ItemType.WOOD, 40],
        [ItemType.STONE, 40]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 10,
    bonus: 0
}

RECIPES[ItemType.DIAMOND_CORD] = {
    r: [
        [ItemType.DIAMOND, 1],
        [ItemType.CORD, 1]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 3,
    bonus: 0
}
RECIPES[ItemType.RESURRECTION] = {
    r: [
        [ItemType.DIAMOND, 40],
        [ItemType.STONE, 45]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 20,
    bonus: 0
}
RECIPES[ItemType.EMERALD_MACHINE] = {
    r: [
        [ItemType.RESURRECTION, 1],
        [ItemType.EMERALD, 40],
        [ItemType.SANDWORM_JUICE, 1]
    ],
    f: 1,
    e: 0,
    w: 1,
    o: 1,
    time: 200,
    bonus: 0
}
RECIPES[ItemType.LOCK_PICK] = {
    r: [
        [ItemType.GOLD, 250]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 60,
    bonus: 0
}
RECIPES[ItemType.LOCK] = {
    r: [
        [ItemType.GOLD, 10]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 5,
    bonus: 0
}
RECIPES[ItemType.TOTEM] = {
    r: [
        [ItemType.WOOD, 50]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 10,
    bonus: 0
}
RECIPES[ItemType.CHEST] = {
    r: [
        [ItemType.WOOD, 25],
        [ItemType.GOLD, 2]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 5,
    bonus: 0
}
RECIPES[ItemType.WELL] = {
    r: [
        [ItemType.STONE, 100],
        [ItemType.GROUND, 30]
    ],
    f: 1,
    e: 0,
    w: 1,
    o: 0,
    time: 10,
    bonus: 0
}
RECIPES[ItemType.BANDAGE] = {
    r: [
        [ItemType.CORD, 2]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 5,
    bonus: 0
}
RECIPES[ItemType.ROOF] = {
    r: [
        [ItemType.WOOD, 30]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 5,
    bonus: 0
}
RECIPES[ItemType.BED] = {
    r: [
        [ItemType.WOOD, 100],
        [ItemType.STONE, 50],
        [ItemType.RABBIT_FUR, 5],
        [ItemType.WOLF_FUR, 5],
        [ItemType.CORD, 6]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 20,
    bonus: 0
}
RECIPES[ItemType.BOAT] = {
    r: [
        [ItemType.WOOD, 250],
        [ItemType.DIAMOND_CORD, 10],
        [ItemType.WINTER_FUR, 2],
        [ItemType.PIRANHA_SCALES, 2]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 50,
    bonus: 1000
}
RECIPES[ItemType.SLED] = {
    r: [
        [ItemType.WOOD, 250],
        [ItemType.CORD, 10],
        [ItemType.WINTER_FUR, 2],
        [ItemType.PENGUIN_FEATHER, 8]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 50,
    bonus: 0
}
RECIPES[ItemType.PLANE] = {
    r: [
        [ItemType.WOOD, 250],
        [ItemType.CORD, 10],
        [ItemType.PAPER, 10],
        [ItemType.HAWK_FEATHER, 8]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 50,
    bonus: 0
}
RECIPES[ItemType.BERRY_SEED] = {
    r: [
        [ItemType.BERRY, 3]
    ],
    f: 1,
    e: 0,
    w: 0,
    o: 0,
    time: 5,
    bonus: 0
}
RECIPES[ItemType.WHEAT_SEED] = {
    r: [
        [ItemType.WHEAT, 3]
    ],
    f: 1,
    e: 0,
    w: 0,
    o: 0,
    time: 5,
    bonus: 0
}
RECIPES[ItemType.PUMPKIN_SEED] = {
    r: [
        [ItemType.PUMPKIN, 8]
    ],
    f: 1,
    e: 0,
    w: 0,
    o: 0,
    time: 5,
    bonus: 0
}
RECIPES[ItemType.CARROT_SEED] = {
    r: [
        [ItemType.CARROT, 8]
    ],
    f: 1,
    e: 0,
    w: 0,
    o: 0,
    time: 5,
    bonus: 0
}
RECIPES[ItemType.TOMATO_SEED] = {
    r: [
        [ItemType.TOMATO, 8]
    ],
    f: 1,
    e: 0,
    w: 0,
    o: 0,
    time: 5,
    bonus: 0
}
RECIPES[ItemType.THORNBUSH_SEED] = {
    r: [
        [ItemType.THORNBUSH, 8]
    ],
    f: 1,
    e: 0,
    w: 0,
    o: 0,
    time: 5,
    bonus: 0
}
RECIPES[ItemType.GARLIC_SEED] = {
    r: [
        [ItemType.GARLIC, 8]
    ],
    f: 1,
    e: 0,
    w: 0,
    o: 0,
    time: 5,
    bonus: 0
}
RECIPES[ItemType.WATERMELON_SEED] = {
    r: [
        [ItemType.WATERMELON, 16]
    ],
    f: 1,
    e: 0,
    w: 0,
    o: 0,
    time: 5,
    bonus: 0
}
RECIPES[ItemType.ALOE_VERA_SEED] = {
    r: [
        [ItemType.ALOE_VERA, 16]
    ],
    f: 1,
    e: 0,
    w: 0,
    o: 0,
    time: 5,
    bonus: 0
}
RECIPES[ItemType.BREAD] = {
    r: [
        [ItemType.FLOUR, 3]
    ],
    f: 1,
    e: 0,
    w: 0,
    o: 0,
    time: 3,
    bonus: 0
}
RECIPES[ItemType.SANDWICH] = {
    r: [
        [ItemType.BREAD, 1],
        [ItemType.COOKED_MEAT, 1]
    ],
    f: 0,
    e: 0,
    w: 0,
    o: 0,
    time: 3,
    bonus: 0
}
RECIPES[ItemType.BOTTLE_FULL] = {
    r: [
        [ItemType.BOTTLE_EMPTY, 1]
    ],
    f: 0,
    e: 1,
    w: 0,
    o: 0,
    time: 3,
    bonus: 0
}
RECIPES[ItemType.BOTTLE_FULL_2] = {
    r: [
        [ItemType.BOTTLE_EMPTY, 1],
        [ItemType.ICE, 20]
    ],
    f: 1,
    e: 0,
    w: 0,
    o: 0,
    time: 3,
    bonus: 0
}
RECIPES[ItemType.BOTTLE_FULL_3] = {
    r: [
        [ItemType.BOTTLE_EMPTY, 1],
    ],
    f: 0,
    e: 0,
    w: 0,
    o: 1,
    time: 3,
    bonus: 0
}
RECIPES[ItemType.BOTTLE_EMPTY] = {
    r: [
        [ItemType.SAND, 25]
    ],
    f: 1,
    e: 0,
    w: 1,
    o: 0,
    time: 5,
    bonus: 0
}
RECIPES[ItemType.COOKIE] = {
    r: [
        [ItemType.FLOUR, 3],
        [ItemType.BERRY, 1]
    ],
    f: 1,
    e: 0,
    w: 0,
    o: 0,
    time: 3,
    bonus: 0
}
RECIPES[ItemType.CAKE] = {
    r: [
        [ItemType.FLOUR, 5],
        [ItemType.BERRY, 2],
        [ItemType.ICE, 2]
    ],
    f: 1,
    e: 0,
    w: 0,
    o: 0,
    time: 5,
    bonus: 0
}
RECIPES[ItemType.FISH_COOKED] = {
    r: [
        [ItemType.FISH, 1]
    ],
    f: 1,
    e: 0,
    w: 0,
    o: 0,
    time: 3,
    bonus: 0
}
RECIPES[ItemType.COOKED_MEAT] = {
    r: [
        [ItemType.MEAT, 1]
    ],
    f: 1,
    e: 0,
    w: 0,
    o: 0,
    time: 5,
    bonus: 0
}
RECIPES[ItemType.BUCKET_FULL] = {
    r: [
        [ItemType.BUCKET_EMPTY, 1]
    ],
    f: 0,
    e: 0,
    w: 0,
    o: 1,
    time: 5,
    bonus: 0
}
RECIPES[ItemType.BUCKET_EMPTY] = {
    r: [
        [ItemType.WOOD, 20],
        [ItemType.CORD, 1]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 5,
    bonus: 0
}
RECIPES[ItemType.WOOD_WALL] = {
    r: [
        [ItemType.WOOD, 20]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 5,
    bonus: 0
}
RECIPES[ItemType.STONE_WALL] = {
    r: [
        [ItemType.WOOD_WALL, 1],
        [ItemType.STONE, 17]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 5,
    bonus: 0
}
RECIPES[ItemType.GOLD_WALL] = {
    r: [
        [ItemType.STONE_WALL, 1],
        [ItemType.GOLD, 14]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 5,
    bonus: 0
}
RECIPES[ItemType.DIAMOND_WALL] = {
    r: [
        [ItemType.GOLD_WALL, 1],
        [ItemType.DIAMOND, 11]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 5,
    bonus: 0
}
RECIPES[ItemType.AMETHYST_WALL] = {
    r: [
        [ItemType.DIAMOND_WALL, 1],
        [ItemType.AMETHYST, 8]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 5,
    bonus: 0
}
RECIPES[ItemType.REIDITE_WALL] = {
    r: [
        [ItemType.AMETHYST_WALL, 1],
        [ItemType.REIDITE, 5]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 5,
    bonus: 0
}
RECIPES[ItemType.WOOD_SPIKE] = {
    r: [
        [ItemType.WOOD_WALL, 1],
        [ItemType.WOOD, 40],
        [ItemType.STONE, 30]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 20,
    bonus: 0
}
RECIPES[ItemType.STONE_SPIKE] = {
    r: [
        [ItemType.STONE_WALL, 1],
        [ItemType.STONE, 70]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 20,
    bonus: 0
}
RECIPES[ItemType.GOLD_SPIKE] = {
    r: [
        [ItemType.GOLD_WALL, 1],
        [ItemType.GOLD, 40],
        [ItemType.STONE, 30]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 20,
    bonus: 0
}
RECIPES[ItemType.DIAMOND_SPIKE] = {
    r: [
        [ItemType.DIAMOND_WALL, 1],
        [ItemType.DIAMOND, 40],
        [ItemType.STONE, 30]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 20,
    bonus: 0
}
RECIPES[ItemType.AMETHYST_SPIKE] = {
    r: [
        [ItemType.AMETHYST_WALL, 1],
        [ItemType.AMETHYST, 40],
        [ItemType.STONE, 30]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 20,
    bonus: 0
}
RECIPES[ItemType.REIDITE_SPIKE] = {
    r: [
        [ItemType.REIDITE_WALL, 1],
        [ItemType.REIDITE, 40],
        [ItemType.GOLD, 30]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 20,
    bonus: 0
}
RECIPES[ItemType.WOOD_DOOR] = {
    r: [
        [ItemType.WOOD, 30]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 8,
    bonus: 0
}
RECIPES[ItemType.STONE_DOOR] = {
    r: [
        [ItemType.WOOD_DOOR, 1],
        [ItemType.STONE, 27]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 8,
    bonus: 0
}
RECIPES[ItemType.GOLD_DOOR] = {
    r: [
        [ItemType.STONE_DOOR, 1],
        [ItemType.GOLD, 24]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 8,
    bonus: 0
}
RECIPES[ItemType.DIAMOND_DOOR] = {
    r: [
        [ItemType.GOLD_DOOR, 1],
        [ItemType.DIAMOND, 21]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 8,
    bonus: 0
}
RECIPES[ItemType.AMETHYST_DOOR] = {
    r: [
        [ItemType.DIAMOND_DOOR, 1],
        [ItemType.AMETHYST, 18]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 8,
    bonus: 0
}
RECIPES[ItemType.REIDITE_DOOR] = {
    r: [
        [ItemType.AMETHYST_DOOR, 1],
        [ItemType.REIDITE, 15]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 8,
    bonus: 0
}
RECIPES[ItemType.WOOD_DOOR_SPIKE] = {
    r: [
        [ItemType.WOOD_DOOR, 1],
        [ItemType.WOOD, 80],
        [ItemType.STONE, 60]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 20,
    bonus: 0
}
RECIPES[ItemType.STONE_DOOR_SPIKE] = {
    r: [
        [ItemType.STONE_DOOR, 1],
        [ItemType.STONE, 140]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 20,
    bonus: 0
}
RECIPES[ItemType.GOLD_DOOR_SPIKE] = {
    r: [
        [ItemType.GOLD_DOOR, 1],
        [ItemType.GOLD, 80],
        [ItemType.STONE, 60]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 20,
    bonus: 0
}
RECIPES[ItemType.DIAMOND_DOOR_SPIKE] = {
    r: [
        [ItemType.DIAMOND_DOOR, 1],
        [ItemType.DIAMOND, 80],
        [ItemType.STONE, 60]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 20,
    bonus: 0
}
RECIPES[ItemType.AMETHYST_DOOR_SPIKE] = {
    r: [
        [ItemType.AMETHYST_DOOR, 1],
        [ItemType.AMETHYST, 80],
        [ItemType.STONE, 60]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 20,
    bonus: 0
}

RECIPES[ItemType.REIDITE_DOOR_SPIKE] = {
    r: [
        [ItemType.REIDITE_DOOR, 1],
        [ItemType.REIDITE, 80],
        [ItemType.GOLD, 60]
    ],
    f: 0,
    e: 0,
    w: 1,
    o: 0,
    time: 20,
    bonus: 0
}