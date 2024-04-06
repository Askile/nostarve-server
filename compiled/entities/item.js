"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Item = void 0;
const item_type_1 = require("../enums/types/item.type");
const vehicles = new Set([
    item_type_1.ItemType.BABY_DRAGON, item_type_1.ItemType.BABY_LAVA, item_type_1.ItemType.HAWK, item_type_1.ItemType.BOAT, item_type_1.ItemType.PLANE,
    item_type_1.ItemType.BABY_MAMMOTH, item_type_1.ItemType.BOAR, item_type_1.ItemType.CRAB_BOSS, item_type_1.ItemType.NIMBUS, item_type_1.ItemType.SLED
]);
const flights = new Set([
    item_type_1.ItemType.PLANE, item_type_1.ItemType.NIMBUS, item_type_1.ItemType.HAWK,
    item_type_1.ItemType.BABY_DRAGON, item_type_1.ItemType.BABY_LAVA
]);
const tools = new Set([
    item_type_1.ItemType.WOOD_PICK, item_type_1.ItemType.STONE_PICK, item_type_1.ItemType.GOLD_PICK, item_type_1.ItemType.DIAMOND_PICK, item_type_1.ItemType.AMETHYST_PICK, item_type_1.ItemType.REIDITE_PICK,
    item_type_1.ItemType.WRENCH, item_type_1.ItemType.WATERING_CAN_FULL, item_type_1.ItemType.BOOK, item_type_1.ItemType.MACHETE, item_type_1.ItemType.PITCHFORK, item_type_1.ItemType.GOLD_PITCHFORK,
    item_type_1.ItemType.STONE_SHOVEL, item_type_1.ItemType.GOLD_SHOVEL, item_type_1.ItemType.DIAMOND_SHOVEL, item_type_1.ItemType.SADDLE,
    item_type_1.ItemType.AMETHYST_SHOVEL, item_type_1.ItemType.REIDITE_SHOVEL
]);
const hammers = new Set([
    item_type_1.ItemType.STONE_HAMMER, item_type_1.ItemType.GOLD_HAMMER, item_type_1.ItemType.DIAMOND_HAMMER,
    item_type_1.ItemType.AMETHYST_HAMMER, item_type_1.ItemType.REIDITE_HAMMER, item_type_1.ItemType.SUPER_HAMMER
]);
const swords = new Set([
    item_type_1.ItemType.WOOD_SWORD, item_type_1.ItemType.STONE_SWORD, item_type_1.ItemType.GOLD_SWORD, item_type_1.ItemType.DIAMOND_SWORD, item_type_1.ItemType.AMETHYST_SWORD,
    item_type_1.ItemType.REIDITE_SWORD, item_type_1.ItemType.DRAGON_SWORD, item_type_1.ItemType.LAVA_SWORD, item_type_1.ItemType.CURSED_SWORD, item_type_1.ItemType.PIRATE_SWORD
]);
const spears = new Set([
    item_type_1.ItemType.WOOD_SPEAR, item_type_1.ItemType.STONE_SPEAR, item_type_1.ItemType.GOLD_SPEAR, item_type_1.ItemType.DIAMOND_SPEAR, item_type_1.ItemType.AMETHYST_SPEAR,
    item_type_1.ItemType.REIDITE_SPEAR, item_type_1.ItemType.DRAGON_SPEAR, item_type_1.ItemType.LAVA_SPEAR, item_type_1.ItemType.CRAB_SPEAR
]);
const hats = new Set([
    item_type_1.ItemType.WITCH_HAT,
    item_type_1.ItemType.WOOD_HELMET, item_type_1.ItemType.STONE_HELMET, item_type_1.ItemType.GOLD_HELMET, item_type_1.ItemType.DIAMOND_HELMET, item_type_1.ItemType.AMETHYST_HELMET,
    item_type_1.ItemType.REIDITE_HELMET, item_type_1.ItemType.DRAGON_HELMET, item_type_1.ItemType.LAVA_HELMET, item_type_1.ItemType.CRAB_HELMET,
    item_type_1.ItemType.CROWN_BLUE, item_type_1.ItemType.CROWN_GREEN, item_type_1.ItemType.CROWN_ORANGE,
    item_type_1.ItemType.EARMUFFS, item_type_1.ItemType.COAT, item_type_1.ItemType.CAP_SCARF, item_type_1.ItemType.FUR_HAT,
    item_type_1.ItemType.HOOD, item_type_1.ItemType.WINTER_HOOD, item_type_1.ItemType.PEASANT, item_type_1.ItemType.WINTER_PEASANT,
    item_type_1.ItemType.TURBAN1, item_type_1.ItemType.TURBAN2, item_type_1.ItemType.DIVING_MASK, item_type_1.ItemType.SUPER_DIVING_SUIT,
    item_type_1.ItemType.DIAMOND_PROTECTION, item_type_1.ItemType.AMETHYST_PROTECTION, item_type_1.ItemType.REIDITE_PROTECTION,
    item_type_1.ItemType.PILOT_HAT, item_type_1.ItemType.PIRATE_HAT, item_type_1.ItemType.EXPLORER_HAT
]);
const cooldownHats = new Set([
    item_type_1.ItemType.WOOD_HELMET, item_type_1.ItemType.STONE_HELMET, item_type_1.ItemType.GOLD_HELMET, item_type_1.ItemType.DIAMOND_HELMET, item_type_1.ItemType.AMETHYST_HELMET,
    item_type_1.ItemType.REIDITE_HELMET, item_type_1.ItemType.DRAGON_HELMET, item_type_1.ItemType.LAVA_HELMET, item_type_1.ItemType.CRAB_HELMET,
    item_type_1.ItemType.CROWN_BLUE, item_type_1.ItemType.CROWN_GREEN, item_type_1.ItemType.CROWN_ORANGE
]);
const clickable = new Set([
    item_type_1.ItemType.BERRY, item_type_1.ItemType.PUMPKIN, item_type_1.ItemType.GARLIC,
    item_type_1.ItemType.CARROT, item_type_1.ItemType.TOMATO, item_type_1.ItemType.WATERMELON,
    item_type_1.ItemType.COOKIE, item_type_1.ItemType.SUGAR_CAN, item_type_1.ItemType.CAKE,
    item_type_1.ItemType.MEAT, item_type_1.ItemType.FISH, item_type_1.ItemType.CACTUS,
    item_type_1.ItemType.COOKED_MEAT, item_type_1.ItemType.FISH_COOKED,
    item_type_1.ItemType.BREAD, item_type_1.ItemType.SANDWICH, item_type_1.ItemType.ALOE_VERA,
    item_type_1.ItemType.ICE, item_type_1.ItemType.BOTTLE_FULL, item_type_1.ItemType.BANDAGE
]);
const bows = new Set([
    item_type_1.ItemType.WAND1, item_type_1.ItemType.WAND2,
    item_type_1.ItemType.WOOD_BOW, item_type_1.ItemType.STONE_BOW, item_type_1.ItemType.GOLD_BOW, item_type_1.ItemType.DIAMOND_BOW,
    item_type_1.ItemType.AMETHYST_BOW, item_type_1.ItemType.REIDITE_BOW, item_type_1.ItemType.DRAGON_BOW
]);
const shields = new Set([
    item_type_1.ItemType.WOOD_SHIELD, item_type_1.ItemType.STONE_SHIELD, item_type_1.ItemType.GOLD_SHIELD,
    item_type_1.ItemType.DIAMOND_SHIELD, item_type_1.ItemType.AMETHYST_SHIELD, item_type_1.ItemType.REIDITE_SHIELD
]);
class Item {
    id;
    defense;
    mob_defense;
    damage;
    building_damage;
    offset;
    radius;
    /* pickaxes, hand */
    harvest;
    /* shovels */
    dig;
    /* bottle, watermelon */
    water;
    food;
    /* bandage, aloe */
    heal;
    cold;
    constructor(id, configSystem) {
        this.id = id;
        this.defense = configSystem.itemDefense[id] ?? 0;
        this.mob_defense = configSystem.itemMobDefense[id] ?? 0;
        this.damage = configSystem.itemDamage[id] ?? 0;
        this.building_damage = configSystem.itemBuildingDamage[id] ?? this.damage / 3;
        this.harvest = configSystem.itemHarvest[id] ?? 0;
        this.dig = configSystem.itemDig[id] ?? 0;
        this.water = configSystem.itemWaterValue[id] ?? 0;
        this.food = configSystem.itemFoodValue[id] ?? 0;
        this.heal = configSystem.itemHealValue[id] ?? 0;
        this.cold = configSystem.itemColdValue[id] ?? 0;
        this.radius = configSystem.itemRadius[id] ?? 0;
        this.offset = configSystem.itemOffset[id] ?? 0;
    }
    isVehicle() {
        return vehicles.has(this.id);
    }
    isFlight() {
        return flights.has(this.id);
    }
    isHat() {
        return hats.has(this.id);
    }
    isCooldown() {
        return cooldownHats.has(this.id);
    }
    isSlowDown() {
        return this.isSpear() || this.isSword() || this.isBow();
    }
    isFood() {
        return clickable.has(this.id);
    }
    isEquipment() {
        return this.isSword() || this.isBow() || this.isShield() || this.isSpear() || this.isTool() || this.isHammer();
    }
    isTool() {
        return tools.has(this.id);
    }
    isSword() {
        return swords.has(this.id);
    }
    isBow() {
        return bows.has(this.id);
    }
    isSpear() {
        return spears.has(this.id);
    }
    isHammer() {
        return hammers.has(this.id);
    }
    isShield() {
        return shields.has(this.id);
    }
}
exports.Item = Item;
