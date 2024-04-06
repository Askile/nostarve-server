import {EntityType} from "../enums/types/entity.type";
import {ItemType} from "../enums/types/item.type";
import {Server} from "../server";

export class ConfigSystem {
    public health: number[];

    public server: Server;
    public items: any[];

    public entityRadius: number[];
    public entityDamage: number[];
    public entityOnHitDamage: number[];

    public itemDamage: number[];
    public itemDefense: number[];
    public itemMobDefense: number[];
    public itemBuildingDamage: number[];
    public itemHarvest: number[];
    public itemDig: number[];
    public itemRadius: number[];
    public itemOffset: number[];
    public itemColdValue: number[];
    public itemWaterValue: number[];
    public itemHealValue: number[];
    public itemFoodValue: number[];

    public treasureDropChance: number[];
    public dropChance: number[];

    public seedBirth: number[];
    public seedLife: number[];
    public seedFruitsCount: number[];
    public seedFruits: number[];

    public seedGrowth: number[];
    public seedDrain: number[];

    public config: Config;
    constructor(server: Server) {
        this.server = server;
        this.config = server.config;
        this.items = [];

        const EntityIndex = Object.values(EntityType)[Object.values(EntityType).length - 1] as number;
        const ItemIndex = Object.values(ItemType)[Object.values(ItemType).length - 1] as number;

        this.health = new Array(EntityIndex).fill(0);
        this.entityDamage = new Array(EntityIndex).fill(0);
        this.entityOnHitDamage = new Array(EntityIndex).fill(0);
        this.entityRadius = new Array(EntityIndex).fill(25);
        this.seedBirth = new Array(EntityIndex).fill(0);
        this.seedGrowth = new Array(EntityIndex).fill(0);
        this.seedDrain = new Array(EntityIndex).fill(0);
        this.seedLife = new Array(EntityIndex).fill(0);
        this.seedFruitsCount = new Array(EntityIndex).fill(0);
        this.seedFruits = new Array(EntityIndex).fill(0);

        this.itemDefense = new Array(ItemIndex).fill(0);
        this.itemMobDefense = new Array(ItemIndex).fill(0);
        this.itemDamage = new Array(ItemIndex).fill(0);
        this.itemBuildingDamage = new Array(ItemIndex).fill(0);
        this.itemHarvest = new Array(ItemIndex).fill(0);
        this.itemDig = new Array(ItemIndex).fill(0);
        this.itemRadius = new Array(ItemIndex).fill(0);
        this.itemOffset = new Array(ItemIndex).fill(0);
        this.itemColdValue = new Array(ItemIndex).fill(0);
        this.itemFoodValue = new Array(ItemIndex).fill(0);
        this.itemWaterValue = new Array(ItemIndex).fill(0);
        this.itemHealValue = new Array(ItemIndex).fill(0);

        this.dropChance = new Array(ItemIndex).fill(0);
        this.treasureDropChance = new Array(ItemIndex).fill(0);

        this.setupChances();
        this.setupItems();
        this.setupDamage();
        this.setupCollide();
        this.setupRadius();
        this.setupHealth();
        this.setupSeeds();
        this.loadConfig();
    }

    public loadConfig() {
        // const items = fs.readdirSync("./config/items");
        //
        // for (const fileName of items) {
        //     try {
        //         const config = JSON.parse(fs.readFileSync("./config/items/" + fileName, "utf-8"));
        //         const name = fileName.replace(/\.json$/g, "");
        //         const item = ItemType[name.toUpperCase()];
        //         if (item === undefined) {
        //             this.server.logger.warn("Invalid type in item config: " + name);
        //             continue;
        //         }
        //
        //         this.server.logger.log("Loaded item with name: " + name + " and type: " + item);
        //         this.items[item] = config;
        //     } catch (e) {
        //         this.server.logger.error(e);
        //     }
        // }
    }

    public setupItems() {
        this.itemDefense[ItemType.WOOD_HELMET]             = this.config.wood_helmet_defense ?? -1;
        this.itemDefense[ItemType.STONE_HELMET]            = this.config.stone_helmet_defense ?? -2;
        this.itemDefense[ItemType.GOLD_HELMET]             = this.config.gold_helmet_defense ?? -4;
        this.itemDefense[ItemType.DIAMOND_HELMET]          = this.config.diamond_helmet_defense ?? -5;
        this.itemDefense[ItemType.CRAB_HELMET]             = this.config.crab_helmet_defense ?? -5;
        this.itemDefense[ItemType.AMETHYST_HELMET]         = this.config.amethyst_helmet_defense ?? -6;
        this.itemDefense[ItemType.REIDITE_HELMET]          = this.config.reidite_helmet_defense ?? -7;
        this.itemDefense[ItemType.DRAGON_HELMET]           = this.config.dragon_helmet_defense ?? -8;
        this.itemDefense[ItemType.LAVA_HELMET]             = this.config.lava_helmet_defense ?? -9;

        this.itemDefense[ItemType.WOOD_SHIELD]             = this.config.wood_shield_defense ?? 1;
        this.itemDefense[ItemType.STONE_SHIELD]            = this.config.stone_shield_defense ?? 2;
        this.itemDefense[ItemType.GOLD_SHIELD]             = this.config.gold_shield_defense ?? 3;
        this.itemDefense[ItemType.DIAMOND_SHIELD]          = this.config.diamond_shield_defense ?? 4;
        this.itemDefense[ItemType.AMETHYST_SHIELD]         = this.config.amethyst_shield_defense ?? 5;
        this.itemDefense[ItemType.REIDITE_SHIELD]          = this.config.reidite_shield_defense ?? 6;

        this.itemDefense[ItemType.HOOD]                    = this.config.hood_defense ?? 0;
        this.itemDefense[ItemType.WINTER_HOOD]             = this.config.winter_hood_defense ?? 0;
        this.itemDefense[ItemType.PEASANT]                 = this.config.peasant_defense ?? 0;
        this.itemDefense[ItemType.WINTER_PEASANT]          = this.config.winter_peasant_defense ?? 0;

        this.itemDefense[ItemType.DIVING_MASK]             = this.config.diving_mask_defense ?? 2;
        this.itemDefense[ItemType.SUPER_DIVING_SUIT]       = this.config.super_diving_suit_defense ?? 4;

        this.itemDefense[ItemType.DIAMOND_PROTECTION]      = this.config.warm_protection_defense ?? 2;
        this.itemDefense[ItemType.AMETHYST_PROTECTION]     = this.config.warm_protection2_defense ?? 4;
        this.itemDefense[ItemType.REIDITE_PROTECTION]      = this.config.warm_protection3_defense ?? 6;

        this.itemDefense[ItemType.EARMUFFS]                = this.config.earmuff_defense ?? 0;
        this.itemDefense[ItemType.COAT]                    = this.config.coat_defense ?? 0;
        this.itemDefense[ItemType.CAP_SCARF]               = this.config.scarf_defense ?? 0;
        this.itemDefense[ItemType.FUR_HAT]                 = this.config.fur_hat_defense ?? 0;

        this.itemDefense[ItemType.CROWN_GREEN]             = this.config.green_crown_defense ?? 4;
        this.itemDefense[ItemType.CROWN_BLUE]              = this.config.blue_crown_defense ?? 4;
        this.itemDefense[ItemType.CROWN_ORANGE]            = this.config.orange_crown_defense ?? 4;

        this.itemDefense[ItemType.EXPLORER_HAT]            = this.config.explorer_hat_defense ?? 0;
        this.itemDefense[ItemType.PIRATE_HAT]              = this.config.pirate_hat_defense ?? 0;

        this.itemMobDefense[ItemType.EXPLORER_HAT]         = this.config.explorer_hat_mob_defense ?? 0;
        this.itemMobDefense[ItemType.PIRATE_HAT]           = this.config.pirate_hat_mob_defense ?? 0;

        this.itemMobDefense[ItemType.CROWN_GREEN]          = this.config.green_crown_mob_defense ?? 4;
        this.itemMobDefense[ItemType.CROWN_BLUE]           = this.config.blue_crown_mob_defense ?? 4;
        this.itemMobDefense[ItemType.CROWN_ORANGE]         = this.config.orange_crown_mob_defense ?? 4;

        this.itemMobDefense[ItemType.EARMUFFS]             = this.config.earmuff_mob_defense ?? 0;
        this.itemMobDefense[ItemType.COAT]                 = this.config.coat_mob_defense ?? 0;
        this.itemMobDefense[ItemType.CAP_SCARF]            = this.config.scarf_mob_defense ?? 0;
        this.itemMobDefense[ItemType.FUR_HAT]              = this.config.fur_hat_mob_defense ?? 0;

        this.itemMobDefense[ItemType.DIAMOND_PROTECTION]   = this.config.warm_protection_mob_defense ?? 8;
        this.itemMobDefense[ItemType.AMETHYST_PROTECTION]  = this.config.warm_protection2_mob_defense ?? 13;
        this.itemMobDefense[ItemType.REIDITE_PROTECTION]   = this.config.warm_protection3_mob_defense ?? 19;

        this.itemMobDefense[ItemType.DIVING_MASK]          = this.config.diving_mask_mob_defense ?? 2;
        this.itemMobDefense[ItemType.SUPER_DIVING_SUIT]    = this.config.super_diving_suit_mob_defense ?? 16;

        this.itemMobDefense[ItemType.HOOD]                 = this.config.hood_mob_defense ?? 0;
        this.itemMobDefense[ItemType.WINTER_HOOD]          = this.config.winter_hood_mob_defense ?? 0;
        this.itemMobDefense[ItemType.PEASANT]              = this.config.peasant_mob_defense ?? 0;
        this.itemMobDefense[ItemType.WINTER_PEASANT]       = this.config.winter_peasant_mob_defense ?? 0;

        this.itemMobDefense[ItemType.WOOD_SHIELD]          = this.config.wood_shield_defense_monster ?? 4;
        this.itemMobDefense[ItemType.STONE_SHIELD]         = this.config.stone_shield_defense_monster ?? 8;
        this.itemMobDefense[ItemType.GOLD_SHIELD]          = this.config.gold_shield_defense_monster ?? 12;
        this.itemMobDefense[ItemType.DIAMOND_SHIELD]       = this.config.diamond_shield_defense_monster ?? 16;
        this.itemMobDefense[ItemType.AMETHYST_SHIELD]      = this.config.amethyst_shield_defense_monster ?? 20;
        this.itemMobDefense[ItemType.REIDITE_SHIELD]       = this.config.reidite_shield_defense_monster ?? 24;

        this.itemMobDefense[ItemType.WOOD_HELMET]          = this.config.wood_helmet_mob_defense ?? -4;
        this.itemMobDefense[ItemType.STONE_HELMET]         = this.config.stone_helmet_mob_defense ?? -8;
        this.itemMobDefense[ItemType.GOLD_HELMET]          = this.config.gold_helmet_mob_defense ?? -13;
        this.itemMobDefense[ItemType.DIAMOND_HELMET]       = this.config.diamond_helmet_mob_defense ?? -19;
        this.itemMobDefense[ItemType.CRAB_HELMET]          = this.config.crab_helmet_defense ?? -19;
        this.itemMobDefense[ItemType.AMETHYST_HELMET]      = this.config.amethyst_helmet_mob_defense ?? -23;
        this.itemMobDefense[ItemType.REIDITE_HELMET]       = this.config.reidite_helmet_mob_defense ?? -25;
        this.itemMobDefense[ItemType.DRAGON_HELMET]        = this.config.dragon_helmet_mob_defense ?? -27;
        this.itemMobDefense[ItemType.LAVA_HELMET]          = this.config.lava_helmet_mob_defense ?? -30;

        this.itemDamage[ItemType.HAND]                     = this.config.hand_damage ?? 5;
        this.itemDamage[ItemType.MACHETE]                  = this.config.hand_damage ?? 5;

        this.itemDamage[ItemType.WOOD_SWORD]               = this.config.wood_sword_damage ?? 12;
        this.itemDamage[ItemType.STONE_SWORD]              = this.config.stone_sword_damage ?? 19;
        this.itemDamage[ItemType.GOLD_SWORD]               = this.config.gold_sword_damage ?? 22;
        this.itemDamage[ItemType.DIAMOND_SWORD]            = this.config.diamond_sword_damage ?? 24;
        this.itemDamage[ItemType.PIRATE_SWORD]             = this.config.pirate_sword_damage ?? 24;
        this.itemDamage[ItemType.AMETHYST_SWORD]           = this.config.amethyst_sword_damage ?? 27;
        this.itemDamage[ItemType.REIDITE_SWORD]            = this.config.reidite_sword_damage ?? 30;
        this.itemDamage[ItemType.DRAGON_SWORD]             = this.config.dragon_sword_damage ?? 30;
        this.itemDamage[ItemType.LAVA_SWORD]               = this.config.lava_sword_damage ?? 33;
        this.itemDamage[ItemType.CURSED_SWORD]             = this.config.cursed_sword_damage ?? 4e13;

        this.itemDamage[ItemType.WOOD_SPEAR]               = this.config.wood_spear_damage ?? 10;
        this.itemDamage[ItemType.CRAB_SPEAR]               = this.config.crab_spear_damage ?? 14;
        this.itemDamage[ItemType.STONE_SPEAR]              = this.config.stone_spear_damage ?? 14;
        this.itemDamage[ItemType.GOLD_SPEAR]               = this.config.gold_spear_damage ?? 15;
        this.itemDamage[ItemType.DIAMOND_SPEAR]            = this.config.diamond_spear_damage ?? 17;
        this.itemDamage[ItemType.AMETHYST_SPEAR]           = this.config.amethyst_spear_damage ?? 18;
        this.itemDamage[ItemType.REIDITE_SPEAR]            = this.config.reidite_spear_damage ?? 22;
        this.itemDamage[ItemType.DRAGON_SPEAR]             = this.config.dragon_spear_damage ?? 22;
        this.itemDamage[ItemType.LAVA_SPEAR]               = this.config.lava_spear_damage ?? 24;

        this.itemDamage[ItemType.WOOD_PICK]                = 1;
        this.itemDamage[ItemType.STONE_PICK]               = 2;
        this.itemDamage[ItemType.GOLD_PICK]                = 3;
        this.itemDamage[ItemType.DIAMOND_PICK]             = 4;
        this.itemDamage[ItemType.AMETHYST_PICK]            = 5;
        this.itemDamage[ItemType.REIDITE_PICK]             = 6;

        this.itemDamage[ItemType.WOOD_SHIELD]              = 1;
        this.itemDamage[ItemType.STONE_SHIELD]             = 2;
        this.itemDamage[ItemType.GOLD_SHIELD]              = 3;
        this.itemDamage[ItemType.DIAMOND_SHIELD]           = 4;
        this.itemDamage[ItemType.AMETHYST_SHIELD]          = 5;
        this.itemDamage[ItemType.REIDITE_SHIELD]           = 6;

        this.itemDamage[ItemType.STONE_HAMMER]             = this.config.stone_hammer_damage ?? 2;
        this.itemDamage[ItemType.GOLD_HAMMER]              = this.config.gold_hammer_damage ?? 3;
        this.itemDamage[ItemType.DIAMOND_HAMMER]           = this.config.diamond_hammer_damage ?? 4;
        this.itemDamage[ItemType.AMETHYST_HAMMER]          = this.config.amethyst_hammer_damage ?? 5;
        this.itemDamage[ItemType.REIDITE_HAMMER]           = this.config.reidite_hammer_damage ?? 6;
        this.itemDamage[ItemType.SUPER_HAMMER]             = this.config.super_hammer_damage ?? 12;

        this.itemBuildingDamage[ItemType.STONE_HAMMER]     = this.config.stone_hammer_building_damage ?? 20;
        this.itemBuildingDamage[ItemType.GOLD_HAMMER]      = this.config.gold_hammer_building_damage ?? 30;
        this.itemBuildingDamage[ItemType.DIAMOND_HAMMER]   = this.config.diamond_hammer_building_damage ?? 40;
        this.itemBuildingDamage[ItemType.AMETHYST_HAMMER]  = this.config.amethyst_hammer_building_damage ?? 50;
        this.itemBuildingDamage[ItemType.REIDITE_HAMMER]   = this.config.reidite_hammer_building_damage ?? 60;
        this.itemBuildingDamage[ItemType.SUPER_HAMMER]     = this.config.super_hammer_building_damage ?? 70;
        this.itemBuildingDamage[ItemType.CURSED_SWORD]     = this.config.cursed_sword_damage ?? 4e13;
        this.itemBuildingDamage[ItemType.WRENCH]           = this.config.wrench ?? 70;

        this.itemDamage[ItemType.BOOK]                     = 1;
        this.itemDamage[ItemType.WATERING_CAN_FULL]        = 1;
        this.itemDamage[ItemType.WRENCH]                   = 2;

        this.itemHarvest[ItemType.HAND]                    = 1;
        this.itemHarvest[ItemType.WOOD_PICK]               = 2;
        this.itemHarvest[ItemType.STONE_PICK]              = 3;
        this.itemHarvest[ItemType.GOLD_PICK]               = 4;
        this.itemHarvest[ItemType.DIAMOND_PICK]            = 5;
        this.itemHarvest[ItemType.AMETHYST_PICK]           = 6;
        this.itemHarvest[ItemType.REIDITE_PICK]            = 7;

        this.itemDig[ItemType.STONE_SHOVEL]                = this.config.stone_shovel_dig ?? 1;
        this.itemDig[ItemType.GOLD_SHOVEL]                 = this.config.gold_shovel_dig ?? 2;
        this.itemDig[ItemType.DIAMOND_SHOVEL]              = this.config.diamond_shovel_dig ?? 3;
        this.itemDig[ItemType.AMETHYST_SHOVEL]             = this.config.amethyst_shovel_dig ?? 4;
        this.itemDig[ItemType.REIDITE_SHOVEL]              = this.config.reidite_shovel_dig ?? 5;

        this.itemRadius[ItemType.WOOD_SWORD]               = 45;
        this.itemRadius[ItemType.STONE_SWORD]              = 45;
        this.itemRadius[ItemType.GOLD_SWORD]               = 45;
        this.itemRadius[ItemType.DIAMOND_SWORD]            = 45;
        this.itemRadius[ItemType.AMETHYST_SWORD]           = 45;
        this.itemRadius[ItemType.REIDITE_SWORD]            = 45;
        this.itemRadius[ItemType.DRAGON_SWORD]             = 45;
        this.itemRadius[ItemType.LAVA_SWORD]               = 45;
        this.itemRadius[ItemType.CURSED_SWORD]             = 45;
        this.itemRadius[ItemType.PIRATE_SWORD]             = 48;

        this.itemRadius[ItemType.WOOD_SPEAR]               = 60;
        this.itemRadius[ItemType.STONE_SPEAR]              = 60;
        this.itemRadius[ItemType.GOLD_SPEAR]               = 60;
        this.itemRadius[ItemType.DIAMOND_SPEAR]            = 60;
        this.itemRadius[ItemType.AMETHYST_SPEAR]           = 60;
        this.itemRadius[ItemType.REIDITE_SPEAR]            = 60;
        this.itemRadius[ItemType.REIDITE_SPEAR]            = 60;
        this.itemRadius[ItemType.CRAB_SPEAR]               = 60;
        this.itemRadius[ItemType.DRAGON_SPEAR]             = 60;
        this.itemRadius[ItemType.LAVA_SPEAR]               = 60;

        this.itemRadius[ItemType.WOOD_PICK]                = 60;
        this.itemRadius[ItemType.STONE_PICK]               = 60;
        this.itemRadius[ItemType.GOLD_PICK]                = 60;
        this.itemRadius[ItemType.DIAMOND_PICK]             = 60;
        this.itemRadius[ItemType.AMETHYST_PICK]            = 60;
        this.itemRadius[ItemType.REIDITE_PICK]             = 60;

        this.itemRadius[ItemType.STONE_HAMMER]             = 60;
        this.itemRadius[ItemType.GOLD_HAMMER]              = 60;
        this.itemRadius[ItemType.DIAMOND_HAMMER]           = 60;
        this.itemRadius[ItemType.AMETHYST_HAMMER]          = 60;
        this.itemRadius[ItemType.REIDITE_HAMMER]           = 60;
        this.itemRadius[ItemType.SUPER_HAMMER]             = 60;

        this.itemRadius[ItemType.STONE_SHOVEL]             = 45;
        this.itemRadius[ItemType.GOLD_SHOVEL]              = 45;
        this.itemRadius[ItemType.DIAMOND_SHOVEL]           = 45;
        this.itemRadius[ItemType.AMETHYST_SHOVEL]          = 45;
        this.itemRadius[ItemType.REIDITE_SHOVEL]           = 45;

        this.itemRadius[ItemType.BOOK]                     = 45;
        this.itemRadius[ItemType.WRENCH]                   = 62;
        this.itemRadius[ItemType.WATERING_CAN_EMPTY]       = 45;
        this.itemRadius[ItemType.WATERING_CAN_FULL]        = 45;
        this.itemRadius[ItemType.MACHETE]                  = 45;

        this.itemRadius[ItemType.PITCHFORK]                = 90;
        this.itemRadius[ItemType.GOLD_PITCHFORK]           = 90;

        this.itemRadius[ItemType.WOOD_SHIELD]              = 40;
        this.itemRadius[ItemType.STONE_SHIELD]             = 40;
        this.itemRadius[ItemType.GOLD_SHIELD]              = 40;
        this.itemRadius[ItemType.DIAMOND_SHIELD]           = 40;
        this.itemRadius[ItemType.AMETHYST_SHIELD]          = 40;
        this.itemRadius[ItemType.REIDITE_SHIELD]           = 40;

        this.itemRadius[ItemType.HAND]                     = 22;

        this.itemOffset[ItemType.HAND]                     = 20;

        this.itemOffset[ItemType.WOOD_SHIELD]              = 20;
        this.itemOffset[ItemType.STONE_SHIELD]             = 20;
        this.itemOffset[ItemType.GOLD_SHIELD]              = 20;
        this.itemOffset[ItemType.DIAMOND_SHIELD]           = 20;
        this.itemOffset[ItemType.AMETHYST_SHIELD]          = 20;
        this.itemOffset[ItemType.REIDITE_SHIELD]           = 20;

        this.itemOffset[ItemType.PITCHFORK]                = 130;
        this.itemOffset[ItemType.GOLD_PITCHFORK]           = 130;

        this.itemOffset[ItemType.WRENCH]                   = 50;
        this.itemOffset[ItemType.WATERING_CAN_EMPTY]       = 50;
        this.itemOffset[ItemType.WATERING_CAN_FULL]        = 50;
        this.itemOffset[ItemType.MACHETE]                  = 50;
        this.itemOffset[ItemType.BOOK]                     = 50;

        this.itemOffset[ItemType.STONE_SHOVEL]             = 50;
        this.itemOffset[ItemType.GOLD_SHOVEL]              = 50;
        this.itemOffset[ItemType.DIAMOND_SHOVEL]           = 50;
        this.itemOffset[ItemType.AMETHYST_SHOVEL]          = 50;
        this.itemOffset[ItemType.REIDITE_SHOVEL]           = 50;

        this.itemOffset[ItemType.STONE_HAMMER]             = 50;
        this.itemOffset[ItemType.GOLD_HAMMER]              = 50;
        this.itemOffset[ItemType.DIAMOND_HAMMER]           = 50;
        this.itemOffset[ItemType.AMETHYST_HAMMER]          = 50;
        this.itemOffset[ItemType.REIDITE_HAMMER]           = 50;
        this.itemOffset[ItemType.SUPER_HAMMER]             = 50;

        this.itemOffset[ItemType.WOOD_PICK]                = 50;
        this.itemOffset[ItemType.STONE_PICK]               = 50;
        this.itemOffset[ItemType.GOLD_PICK]                = 50;
        this.itemOffset[ItemType.DIAMOND_PICK]             = 50;
        this.itemOffset[ItemType.AMETHYST_PICK]            = 50;
        this.itemOffset[ItemType.REIDITE_PICK]             = 50;

        this.itemOffset[ItemType.WOOD_SPEAR]               = 110;
        this.itemOffset[ItemType.STONE_SPEAR]              = 110;
        this.itemOffset[ItemType.GOLD_SPEAR]               = 110;
        this.itemOffset[ItemType.DIAMOND_SPEAR]            = 110;
        this.itemOffset[ItemType.AMETHYST_SPEAR]           = 110;
        this.itemOffset[ItemType.REIDITE_SPEAR]            = 110;
        this.itemOffset[ItemType.REIDITE_SPEAR]            = 110;
        this.itemOffset[ItemType.CRAB_SPEAR]               = 110;
        this.itemOffset[ItemType.DRAGON_SPEAR]             = 110;
        this.itemOffset[ItemType.LAVA_SPEAR]               = 110;

        this.itemOffset[ItemType.WOOD_SWORD]               = 65;
        this.itemOffset[ItemType.STONE_SWORD]              = 65;
        this.itemOffset[ItemType.GOLD_SWORD]               = 65;
        this.itemOffset[ItemType.DIAMOND_SWORD]            = 65;
        this.itemOffset[ItemType.AMETHYST_SWORD]           = 65;
        this.itemOffset[ItemType.REIDITE_SWORD]            = 65;
        this.itemOffset[ItemType.DRAGON_SWORD]             = 65;
        this.itemOffset[ItemType.LAVA_SWORD]               = 65;
        this.itemOffset[ItemType.CURSED_SWORD]             = 65;
        this.itemOffset[ItemType.PIRATE_SWORD]             = 68;

        this.itemFoodValue[ItemType.BERRY]                 = 10;
        this.itemFoodValue[ItemType.CRAB_LOOT]             = 10;
        this.itemFoodValue[ItemType.GARLIC]                = 14;
        this.itemFoodValue[ItemType.BREAD]                 = 15;
        this.itemFoodValue[ItemType.MEAT]                  = 15;
        this.itemFoodValue[ItemType.WATERMELON]            = 15;
        this.itemFoodValue[ItemType.TOMATO]                = 16;
        this.itemFoodValue[ItemType.FISH]                  = 18;
        this.itemFoodValue[ItemType.CARROT]                = 20;
        this.itemFoodValue[ItemType.CACTUS]                = 20;
        this.itemFoodValue[ItemType.WATERMELON]            = 20;
        this.itemFoodValue[ItemType.CRAB_STICK]            = 20;
        this.itemFoodValue[ItemType.FISH_COOKED]           = 35;
        this.itemFoodValue[ItemType.COOKED_MEAT]           = 35;
        this.itemFoodValue[ItemType.COOKIE]                = 50;
        this.itemFoodValue[ItemType.SANDWICH]              = 100;
        this.itemFoodValue[ItemType.SUGAR_CAN]             = 100;
        this.itemFoodValue[ItemType.CAKE]                  = 100;

        this.itemColdValue[ItemType.ICE]                   = 20;

        this.itemWaterValue[ItemType.WATERMELON]           = 8;
        this.itemWaterValue[ItemType.BOTTLE_FULL]          = 50;

        this.itemHealValue[ItemType.BANDAGE]               = this.config.bandage_heal_effect ?? 5;
        this.itemHealValue[ItemType.ALOE_VERA]             += 1;
        this.itemHealValue[ItemType.GARLIC]                += 1;
    }

    public setupChances() {
        this.dropChance[ItemType.STONE] = 4;
        this.dropChance[ItemType.GOLD] = 1;
        this.dropChance[ItemType.DIAMOND] = 0.5;

        this.treasureDropChance[ItemType.SUPER_HAMMER] = 0.05;
        this.treasureDropChance[ItemType.SUPER_DIVING_SUIT] = 0.05;
        this.treasureDropChance[ItemType.PIRATE_SWORD] = 0.3;
        this.treasureDropChance[ItemType.DIVING_MASK] = 0.5;

        this.treasureDropChance[ItemType.BOAT] = 1;
        this.treasureDropChance[ItemType.PAPER] = 1;
        this.treasureDropChance[ItemType.SAND] = 5;
        this.treasureDropChance[ItemType.GROUND] = 5;

        this.treasureDropChance[ItemType.AMETHYST_PICK] = 0.6;
        this.treasureDropChance[ItemType.DIAMOND_PICK] = 1.2;
        this.treasureDropChance[ItemType.GOLD_PICK] = 2;
        this.treasureDropChance[ItemType.STONE_PICK] = 2.4;
        this.treasureDropChance[ItemType.WOOD_PICK] = 3;

        this.treasureDropChance[ItemType.AMETHYST_SWORD] = 0.6;
        this.treasureDropChance[ItemType.DIAMOND_SWORD] = 1.2;
        this.treasureDropChance[ItemType.GOLD_SWORD] = 2;
        this.treasureDropChance[ItemType.STONE_SWORD] = 2.4;
        this.treasureDropChance[ItemType.WOOD_SWORD] = 3;

        this.treasureDropChance[ItemType.AMETHYST_SPEAR] = 0.6;
        this.treasureDropChance[ItemType.DIAMOND_SPEAR] = 1.2;
        this.treasureDropChance[ItemType.GOLD_SPEAR] = 2;
        this.treasureDropChance[ItemType.STONE_SPEAR] = 2.4;
        this.treasureDropChance[ItemType.WOOD_SPEAR] = 3;

        this.treasureDropChance[ItemType.BREAD_OVEN] = 1;
        this.treasureDropChance[ItemType.WINDMILL] = 1;
        this.treasureDropChance[ItemType.FURNACE] = 1;
        this.treasureDropChance[ItemType.WELL] = 1;

        this.treasureDropChance[ItemType.REIDITE_SPIKE] = 0.05;
        this.treasureDropChance[ItemType.REIDITE_WALL] = 0.1;
        this.treasureDropChance[ItemType.REIDITE_DOOR] = 0.1;
        this.treasureDropChance[ItemType.AMETHYST_SPIKE] = 0.1;
        this.treasureDropChance[ItemType.AMETHYST_WALL] = 0.15;
        this.treasureDropChance[ItemType.AMETHYST_DOOR] = 0.15;
        this.treasureDropChance[ItemType.DIAMOND_SPIKE] = 0.2;
        this.treasureDropChance[ItemType.DIAMOND_WALL] = 0.25;
        this.treasureDropChance[ItemType.DIAMOND_DOOR] = 0.25;
        this.treasureDropChance[ItemType.GOLD_SPIKE] = 0.25;
        this.treasureDropChance[ItemType.GOLD_WALL] = 0.3;
        this.treasureDropChance[ItemType.GOLD_DOOR] = 0.3;
        this.treasureDropChance[ItemType.STONE_SPIKE] = 0.35;
        this.treasureDropChance[ItemType.STONE_DOOR] = 0.35;
        this.treasureDropChance[ItemType.STONE_WALL] = 0.4;
        this.treasureDropChance[ItemType.WOOD_SPIKE] = 0.45;
        this.treasureDropChance[ItemType.WOOD_DOOR] = 0.5;
        this.treasureDropChance[ItemType.WOOD_WALL] = 0.5;
    }

    public setupSeeds() {
        this.seedBirth[EntityType.BERRY_SEED] = this.config.born_berry ?? 120000; // 2 min
        this.seedBirth[EntityType.WHEAT_SEED] = this.config.born_wheat ?? 120000;
        this.seedBirth[EntityType.PUMPKIN_SEED] = this.config.born_pumpkin ?? 160000;
        this.seedBirth[EntityType.CARROT_SEED] = this.config.born_carrot ?? 240000;
        this.seedBirth[EntityType.TOMATO_SEED] = this.config.born_tomato ?? 240000;
        this.seedBirth[EntityType.THORNBUSH_SEED] = this.config.born_thornbush ?? 240000;
        this.seedBirth[EntityType.GARLIC_SEED] = this.config.born_garlic ?? 160000;
        this.seedBirth[EntityType.WATERMELON_SEED] = this.config.born_watermelon ?? 120000;

        this.seedDrain[EntityType.BERRY_SEED] = this.config.water_berry ?? 200000;
        this.seedDrain[EntityType.WHEAT_SEED] = this.config.water_wheat ?? 200000;
        this.seedDrain[EntityType.PUMPKIN_SEED] = this.config.water_pumpkin ?? 250000;
        this.seedDrain[EntityType.CARROT_SEED] = this.config.water_carrot ?? 200000;
        this.seedDrain[EntityType.TOMATO_SEED] = this.config.water_tomato ?? 200000;
        this.seedDrain[EntityType.THORNBUSH_SEED] = this.config.water_thornbush ?? 240000;
        this.seedDrain[EntityType.GARLIC_SEED] = this.config.water_garlic ?? 200000;
        this.seedDrain[EntityType.WATERMELON_SEED] = this.config.water_watermelon ?? 200000;

        this.seedGrowth[EntityType.BERRY_SEED] = this.config.grown_berry ?? 40000;
        this.seedGrowth[EntityType.WHEAT_SEED] = this.config.grown_wheat ?? 16000;
        this.seedGrowth[EntityType.PUMPKIN_SEED] = this.config.grown_pumpkin ?? 50000;
        this.seedGrowth[EntityType.CARROT_SEED] = this.config.grown_carrot ?? 30000;
        this.seedGrowth[EntityType.TOMATO_SEED] = this.config.grown_tomato ?? 30000;
        this.seedGrowth[EntityType.THORNBUSH_SEED] = this.config.grown_thornbush ?? 15000;
        this.seedGrowth[EntityType.GARLIC_SEED] = this.config.grown_garlic ?? 120000;
        this.seedGrowth[EntityType.WATERMELON_SEED] = this.config.grown_watermelon ?? 40000;

        this.seedLife[EntityType.BERRY_SEED] = this.config.time_life_berry ?? 384e4; // 8 days in starve
        this.seedLife[EntityType.WHEAT_SEED] = this.config.time_life_wheat ?? 384e4;
        this.seedLife[EntityType.PUMPKIN_SEED] = this.config.time_life_pumpkin ?? 384e4;
        this.seedLife[EntityType.CARROT_SEED] = this.config.time_life_carrot ?? 384e4;
        this.seedLife[EntityType.TOMATO_SEED] = this.config.time_life_tomato ?? 384e4;
        this.seedLife[EntityType.THORNBUSH_SEED] = this.config.time_life_thornbush ?? 384e4;
        this.seedLife[EntityType.GARLIC_SEED] = this.config.time_life_garlic ?? 384e4;
        this.seedLife[EntityType.WATERMELON_SEED] = this.config.time_life_watermelon ?? 384e4;

        this.seedFruitsCount[EntityType.BERRY_SEED] = 3;
        this.seedFruitsCount[EntityType.WHEAT_SEED] = 1;
        this.seedFruitsCount[EntityType.PUMPKIN_SEED] = 1;
        this.seedFruitsCount[EntityType.CARROT_SEED] = 1;
        this.seedFruitsCount[EntityType.TOMATO_SEED] = 3;
        this.seedFruitsCount[EntityType.THORNBUSH_SEED] = 1;
        this.seedFruitsCount[EntityType.GARLIC_SEED] = 1;
        this.seedFruitsCount[EntityType.WATERMELON_SEED] = 1;

        this.seedFruits[EntityType.BERRY_SEED] = ItemType.BERRY;
        this.seedFruits[EntityType.WHEAT_SEED] = ItemType.WHEAT;
        this.seedFruits[EntityType.PUMPKIN_SEED] = ItemType.PUMPKIN;
        this.seedFruits[EntityType.CARROT_SEED] = ItemType.CARROT;
        this.seedFruits[EntityType.TOMATO_SEED] = ItemType.TOMATO;
        this.seedFruits[EntityType.THORNBUSH_SEED] = ItemType.THORNBUSH;
        this.seedFruits[EntityType.GARLIC_SEED] = ItemType.GARLIC;
        this.seedFruits[EntityType.WATERMELON_SEED] = ItemType.WATERMELON;
    }

    // public setupSpeed() {
    //     this.speed[EntityType.PLAYER] = this.config.speed ?? 0.24;
    //     this.speed[EntityType.WOLF] = this.config.speed_wolf ?? 0.230;
    //     this.speed[EntityType.SPIDER] = this.config.speed_spider ?? 0.240;
    //     this.speed[EntityType.FOX] = this.config.speed_fox ?? 0.235;
    //     this.speed[EntityType.BEAR] = this.config.speed_bear ?? 0.220;
    //     this.speed[EntityType.DRAGON] = this.config.speed_dragon ?? 0.225;
    //     this.speed[EntityType.PIRANHA] = this.config.speed_piranha ?? 0.290;
    //     this.speed[EntityType.KRAKEN] = this.config.speed_kraken ?? 0.240;
    //     this.speed[EntityType.CRAB] = this.config.speed_crab ?? 0.320;
    //     this.speed[EntityType.FLAME] = this.config.speed_flame ?? 0.240;
    //     this.speed[EntityType.LAVA_DRAGON] = this.config.speed_lava_dragon ?? 0.245;
    //     this.speed[EntityType.BOAR] = this.config.speed_boar ?? 0.300;
    //     this.speed[EntityType.CRAB_BOSS] = this.config.speed_king_crab ?? 0.240;
    //     this.speed[EntityType.BABY_DRAGON] = this.config.speed_baby_dragon ?? 0.250;
    //     this.speed[EntityType.BABY_LAVA] = this.config.speed_baby_lava ?? 0.270;
    //     this.speed[EntityType.HAWK] = this.config.speed_hawk ?? 0.300;
    //     this.speed[EntityType.VULTURE] = this.config.speed_vulture ?? 0.250;
    //     this.speed[EntityType.SAND_WORM] = this.config.speed_sand_worm ?? 0.250;
    //     this.speed[EntityType.BABY_MAMMOTH] = this.config.speed_baby_mammoth ?? 0.230;
    //     this.speed[EntityType.MAMMOTH] = this.config.speed_mammoth ?? 0.230;
    //     this.speed[EntityType.RABBIT] = this.config.speed_rabbit ?? 0.320;
    //     this.speed[EntityType.PENGUIN] = this.config.speed_penguin ?? 0.320;
    // }

    public setupDamage() {
        // Building damage;
        this.entityDamage[EntityType.WOOD_SPIKE] = 10;
        this.entityDamage[EntityType.STONE_SPIKE] = 20;
        this.entityDamage[EntityType.GOLD_SPIKE] = 30;
        this.entityDamage[EntityType.DIAMOND_SPIKE] = 40;
        this.entityDamage[EntityType.AMETHYST_SPIKE] = 50;
        this.entityDamage[EntityType.REIDITE_SPIKE] = 60;

        this.entityDamage[EntityType.WOOD_DOOR_SPIKE] = 5;
        this.entityDamage[EntityType.STONE_DOOR_SPIKE] = 10;
        this.entityDamage[EntityType.GOLD_DOOR_SPIKE] = 15;
        this.entityDamage[EntityType.DIAMOND_DOOR_SPIKE] = 20;
        this.entityDamage[EntityType.AMETHYST_DOOR_SPIKE] = 25;
        this.entityDamage[EntityType.REIDITE_DOOR_SPIKE] = 30;

        this.entityOnHitDamage[EntityType.WOOD_SPIKE] = this.config.wood_spike_damage ?? 2;
        this.entityOnHitDamage[EntityType.STONE_SPIKE] = this.config.stone_spike_damage ?? 2;
        this.entityOnHitDamage[EntityType.GOLD_SPIKE] = this.config.gold_spike_damage ?? 3;
        this.entityOnHitDamage[EntityType.DIAMOND_SPIKE] = this.config.diamond_spike_damage ?? 4;
        this.entityOnHitDamage[EntityType.AMETHYST_SPIKE] = this.config.amethyst_spike_damage ?? 4;
        this.entityOnHitDamage[EntityType.REIDITE_SPIKE] = this.config.reidite_spike_damage ?? 5;

        this.entityOnHitDamage[EntityType.WOOD_DOOR_SPIKE] = this.config.wood_spike_door_damage ?? 1;
        this.entityOnHitDamage[EntityType.STONE_DOOR_SPIKE] = this.config.stone_spike_door_damage ?? 2;
        this.entityOnHitDamage[EntityType.GOLD_DOOR_SPIKE] = this.config.gold_spike_door_damage ?? 2;
        this.entityOnHitDamage[EntityType.DIAMOND_DOOR_SPIKE] = this.config.diamond_spike_door_damage ?? 3;
        this.entityOnHitDamage[EntityType.AMETHYST_DOOR_SPIKE] = this.config.amethyst_spike_door_damage ?? 3;
        this.entityOnHitDamage[EntityType.REIDITE_DOOR_SPIKE] = this.config.reidite_spike_door_damage ?? 4;

        this.entityOnHitDamage[EntityType.EMERALD_MACHINE] = 7;

        // Seed damage
        this.entityDamage[EntityType.THORNBUSH_MOB] = 40;

        // Forest mobs damage
        this.entityDamage[EntityType.WOLF] = this.config.damage_wolf ?? 40;
        this.entityDamage[EntityType.SPIDER] = this.config.damage_spider ?? 30;
        this.entityDamage[EntityType.BOAR] = this.config.damage_boar ?? 50;
        this.entityDamage[EntityType.HAWK] = this.config.damage_hawk ?? 40;
        this.entityDamage[EntityType.CRAB] = this.config.damage_crab ?? 35;
        this.entityDamage[EntityType.CRAB_BOSS] = this.config.damage_king_crab ?? 80;

        // Winter mobs damage
        this.entityDamage[EntityType.FOX] = this.config.damage_fox ?? 25;
        this.entityDamage[EntityType.BEAR] = this.config.damage_bear ?? 60;
        this.entityDamage[EntityType.MAMMOTH] = this.config.damage_mammoth ?? 70;
        this.entityDamage[EntityType.BABY_MAMMOTH] = this.config.damage_baby_mammoth ?? 50;
        this.entityDamage[EntityType.DRAGON] = this.config.damage_dragon ?? 85;
        this.entityDamage[EntityType.BABY_DRAGON] = this.config.damage_baby_dragon ?? 30;

        // Desert mobs damage
        this.entityDamage[EntityType.VULTURE] = this.config.damage_vulture ?? 45;
        this.entityDamage[EntityType.SAND_WORM] = this.config.damage_sand_worm ?? 60;

        // Lava mobs damage
        this.entityDamage[EntityType.LAVA_DRAGON] = this.config.damage_lava_dragon ?? 90;
        this.entityDamage[EntityType.BABY_LAVA] = this.config.damage_baby_lava ?? 70;
        this.entityDamage[EntityType.FLAME] = this.config.damage_flame ?? 50;

        // Ocean mobs damage
        this.entityDamage[EntityType.KRAKEN] = this.config.damage_kraken ?? 80;
        this.entityDamage[EntityType.PIRANHA] = this.config.damage_piranha ?? 40;
    }

    public setupRadius() {
        this.entityRadius[EntityType.WOOD_WALL] = 45;
        this.entityRadius[EntityType.STONE_WALL] = 45;
        this.entityRadius[EntityType.GOLD_WALL] = 45;
        this.entityRadius[EntityType.DIAMOND_WALL] = 45;
        this.entityRadius[EntityType.AMETHYST_WALL] = 45;
        this.entityRadius[EntityType.REIDITE_WALL] = 45;

        this.entityRadius[EntityType.WOOD_DOOR] = 45;
        this.entityRadius[EntityType.STONE_DOOR] = 45;
        this.entityRadius[EntityType.GOLD_DOOR] = 45;
        this.entityRadius[EntityType.DIAMOND_DOOR] = 45;
        this.entityRadius[EntityType.AMETHYST_DOOR] = 45;
        this.entityRadius[EntityType.REIDITE_DOOR] = 45;

        this.entityRadius[EntityType.WOOD_SPIKE] = 35;
        this.entityRadius[EntityType.STONE_SPIKE] = 35;
        this.entityRadius[EntityType.GOLD_SPIKE] = 35;
        this.entityRadius[EntityType.DIAMOND_SPIKE] = 35;
        this.entityRadius[EntityType.AMETHYST_SPIKE] = 35;
        this.entityRadius[EntityType.REIDITE_SPIKE] = 35;

        this.entityRadius[EntityType.WOOD_DOOR_SPIKE] = 35;
        this.entityRadius[EntityType.STONE_DOOR_SPIKE] = 35;
        this.entityRadius[EntityType.GOLD_DOOR_SPIKE] = 35;
        this.entityRadius[EntityType.DIAMOND_DOOR_SPIKE] = 35;
        this.entityRadius[EntityType.AMETHYST_DOOR_SPIKE] = 35;
        this.entityRadius[EntityType.REIDITE_DOOR_SPIKE] = 35;

        this.entityRadius[EntityType.STONE_EXTRACTOR] = 45;
        this.entityRadius[EntityType.GOLD_EXTRACTOR] = 45;
        this.entityRadius[EntityType.DIAMOND_EXTRACTOR] = 45;
        this.entityRadius[EntityType.AMETHYST_EXTRACTOR] = 45;
        this.entityRadius[EntityType.REIDITE_EXTRACTOR] = 45;

        this.entityRadius[EntityType.BERRY_SEED] = 40;
        this.entityRadius[EntityType.WHEAT_SEED] = 40;
        this.entityRadius[EntityType.PUMPKIN_SEED] = 40;
        this.entityRadius[EntityType.CARROT_SEED] = 40;
        this.entityRadius[EntityType.TOMATO_SEED] = 40;
        this.entityRadius[EntityType.THORNBUSH_SEED] = 40;
        this.entityRadius[EntityType.GARLIC_SEED] = 40;
        this.entityRadius[EntityType.WATERMELON_SEED] = 40;

        this.entityRadius[EntityType.RESURRECTION] = 55;
        this.entityRadius[EntityType.EMERALD_MACHINE] = 55;
        this.entityRadius[EntityType.WORKBENCH] = 35;
        this.entityRadius[EntityType.WINDMILL] = 50;
        this.entityRadius[EntityType.FURNACE] = 55;
        this.entityRadius[EntityType.WELL] = 60;
        this.entityRadius[EntityType.BREAD_OVEN] = 60;
        this.entityRadius[EntityType.TOTEM] = 55;
        this.entityRadius[EntityType.WOLF] = 40;
        this.entityRadius[EntityType.SAND_WORM] = 40;
        this.entityRadius[EntityType.SPIDER] = 28;
        this.entityRadius[EntityType.RABBIT] = 45;
        this.entityRadius[EntityType.BOAR] = 65;
        this.entityRadius[EntityType.KRAKEN] = 60;
        this.entityRadius[EntityType.DRAGON] = 50;
        this.entityRadius[EntityType.LAVA_DRAGON] = 60;
    }

    public setupCollide() {
        // this.entityCollide[EntityType.WOOD_WALL] = true;
        // this.entityCollide[EntityType.STONE_WALL] = true;
        // this.entityCollide[EntityType.GOLD_WALL] = true;
        // this.entityCollide[EntityType.DIAMOND_WALL] = true;
        // this.entityCollide[EntityType.AMETHYST_WALL] = true;
        // this.entityCollide[EntityType.REIDITE_WALL] = true;
        //
        // this.entityCollide[EntityType.WOOD_DOOR] = true;
        // this.entityCollide[EntityType.STONE_DOOR] = true;
        // this.entityCollide[EntityType.GOLD_DOOR] = true;
        // this.entityCollide[EntityType.DIAMOND_DOOR] = true;
        // this.entityCollide[EntityType.AMETHYST_DOOR] = true;
        // this.entityCollide[EntityType.REIDITE_DOOR] = true;
        //
        // this.entityCollide[EntityType.WOOD_SPIKE] = true;
        // this.entityCollide[EntityType.STONE_SPIKE] = true;
        // this.entityCollide[EntityType.GOLD_SPIKE] = true;
        // this.entityCollide[EntityType.DIAMOND_SPIKE] = true;
        // this.entityCollide[EntityType.AMETHYST_SPIKE] = true;
        // this.entityCollide[EntityType.REIDITE_SPIKE] = true;
        //
        // this.entityCollide[EntityType.TOTEM] = true;
        //
        // this.entityCollide[EntityType.WOOD_DOOR_SPIKE] = true;
        // this.entityCollide[EntityType.STONE_DOOR_SPIKE] = true;
        // this.entityCollide[EntityType.GOLD_DOOR_SPIKE] = true;
        // this.entityCollide[EntityType.DIAMOND_DOOR_SPIKE] = true;
        // this.entityCollide[EntityType.AMETHYST_DOOR_SPIKE] = true;
        // this.entityCollide[EntityType.REIDITE_DOOR_SPIKE] = true;
        //
        // this.entityCollide[EntityType.STONE_EXTRACTOR] = true;
        // this.entityCollide[EntityType.GOLD_EXTRACTOR] = true;
        // this.entityCollide[EntityType.DIAMOND_EXTRACTOR] = true;
        // this.entityCollide[EntityType.AMETHYST_EXTRACTOR] = true;
        // this.entityCollide[EntityType.REIDITE_EXTRACTOR] = true;
        //
        // this.entityCollide[EntityType.RESURRECTION] = true;
        // this.entityCollide[EntityType.EMERALD_MACHINE] = true;
        // this.entityCollide[EntityType.WINDMILL] = true;
        // this.entityCollide[EntityType.WELL] = true;
        // this.entityCollide[EntityType.BREAD_OVEN] = true;
        // this.entityCollide[EntityType.WORKBENCH] = true;
        // this.entityCollide[EntityType.CHEST] = true;
        // this.entityCollide[EntityType.FURNACE] = true;
    }

    public setupHealth() {
        this.health[EntityType.PLAYER] = 200;
        this.health[EntityType.FIRE] = 150;
        this.health[EntityType.WORKBENCH] = 300;
        this.health[EntityType.BERRY_SEED] = 700;
        this.health[EntityType.WOOD_WALL] = this.config.wood_wall_life ?? 1000;
        this.health[EntityType.WOOD_SPIKE] = this.config.wood_spike_life ?? 150;
        this.health[EntityType.BIG_FIRE] = 400;
        this.health[EntityType.STONE_WALL] = this.config.stone_wall_life ?? 1500;
        this.health[EntityType.GOLD_WALL] = this.config.gold_wall_life ?? 2000;
        this.health[EntityType.DIAMOND_WALL] = this.config.diamond_wall_life ?? 2500;
        this.health[EntityType.WOOD_DOOR] = this.config.wood_door_life ?? 1000;
        this.health[EntityType.CHEST] = 500;
        this.health[EntityType.STONE_SPIKE] = this.config.stone_spike_life ?? 300
        this.health[EntityType.GOLD_SPIKE] = this.config.gold_spike_life ?? 600;
        this.health[EntityType.DIAMOND_SPIKE] = this.config.diamond_spike_life ?? 1200;
        this.health[EntityType.STONE_DOOR] = this.config.stone_door_life ?? 1500;
        this.health[EntityType.GOLD_DOOR] = this.config.gold_door_life ?? 2000;
        this.health[EntityType.DIAMOND_DOOR] = this.config.diamond_door_life ?? 2500;
        this.health[EntityType.FURNACE] = 1000;
        this.health[EntityType.AMETHYST_WALL] = this.config.amethyst_wall_life ?? 3500;
        this.health[EntityType.AMETHYST_SPIKE] = this.config.amethyst_spike_life ?? 2400;
        this.health[EntityType.AMETHYST_DOOR] = this.config.amethyst_door_life ?? 3500;
        this.health[EntityType.RESURRECTION] = 200;
        this.health[EntityType.EMERALD_MACHINE] = 1000;
        this.health[EntityType.STONE_EXTRACTOR] = 2000;
        this.health[EntityType.GOLD_EXTRACTOR] = 2000;
        this.health[EntityType.DIAMOND_EXTRACTOR] = 2000;
        this.health[EntityType.AMETHYST_EXTRACTOR] = 2000;
        this.health[EntityType.REIDITE_EXTRACTOR] = 2000;
        this.health[EntityType.TOTEM] = 300;
        this.health[EntityType.BRIDGE] = 1000;
        this.health[EntityType.WHEAT_SEED] = 700;
        this.health[EntityType.WINDMILL] = 2000;
        this.health[EntityType.PLOT] = this.config.plot_life ?? 2000;
        this.health[EntityType.GARLAND] = 1e9;
        this.health[EntityType.BREAD_OVEN] = 2000;
        this.health[EntityType.WELL] = 1000;
        this.health[EntityType.SIGN] = 200;
        this.health[EntityType.PUMPKIN_SEED] = 700;
        this.health[EntityType.ROOF] = 1000;
        this.health[EntityType.GARLIC_SEED] = 700;
        this.health[EntityType.THORNBUSH_SEED] = 700;
        this.health[EntityType.BED] = 400;
        this.health[EntityType.TOMATO_SEED] = 700;
        this.health[EntityType.CARROT_SEED] = 700;
        this.health[EntityType.WOOD_DOOR_SPIKE] = this.config.wood_spike_door_life ?? 100;
        this.health[EntityType.STONE_DOOR_SPIKE] = this.config.stone_spike_door_life ?? 200;
        this.health[EntityType.GOLD_DOOR_SPIKE] = this.config.gold_spike_door_life ?? 400;
        this.health[EntityType.DIAMOND_DOOR_SPIKE] = this.config.diamond_spike_door_life ?? 800;
        this.health[EntityType.AMETHYST_DOOR_SPIKE] = this.config.amethyst_spike_door_life ?? 1600;
        this.health[EntityType.REIDITE_WALL] = this.config.reidite_wall_life ?? 4000;
        this.health[EntityType.REIDITE_DOOR] = this.config.reidite_wall_life ?? 4000;
        this.health[EntityType.REIDITE_SPIKE] = this.config.reidite_spike_life ?? 3000;
        this.health[EntityType.REIDITE_DOOR_SPIKE] = this.config.reidite_spike_door_life ?? 2000;
        this.health[EntityType.WATERMELON_SEED] = 400;
        this.health[EntityType.ALOE_VERA_SEED] = 400;
        this.health[EntityType.TOWER] = 2000;
        this.health[EntityType.WOLF] = this.config.wolf_life ?? 230;
        this.health[EntityType.SPIDER] = this.config.spider_life ?? 240;
        this.health[EntityType.FOX] = this.config.fox_life ?? 235;
        this.health[EntityType.BEAR] = this.config.bear_life ?? 220;
        this.health[EntityType.DRAGON] = this.config.dragon_life ?? 225;
        this.health[EntityType.PIRANHA] = this.config.piranha_life ?? 290;
        this.health[EntityType.KRAKEN] = this.config.kraken_life ?? 240;
        this.health[EntityType.CRAB] = this.config.crab_life ?? 320;
        this.health[EntityType.FLAME] = this.config.flame_life ?? 240;
        this.health[EntityType.LAVA_DRAGON] = this.config.lava_dragon_life ?? 245;
        this.health[EntityType.BOAR] = this.config.boar_life ?? 300;
        this.health[EntityType.CRAB_BOSS] = this.config.king_crab_life ?? 240;
        this.health[EntityType.BABY_DRAGON] = this.config.baby_dragon_life ?? 250;
        this.health[EntityType.BABY_LAVA] = this.config.baby_lava_life ?? 270;
        this.health[EntityType.HAWK] = this.config.hawk_life ?? 300;
        this.health[EntityType.VULTURE] = this.config.vulture_life ?? 250;
        this.health[EntityType.SAND_WORM] = this.config.sand_worm_life ?? 250;
        this.health[EntityType.BABY_MAMMOTH] = this.config.baby_mammoth_life ?? 230;
        this.health[EntityType.MAMMOTH] = this.config.mammoth_life ?? 230;
        this.health[EntityType.RABBIT] = this.config.rabbit_life ?? 320;
        this.health[EntityType.TREASURE_CHEST] = this.config.treasure_life ?? 300;
        this.health[EntityType.DEAD_BOX] = 300;
        this.health[EntityType.CRATE] = 30;
        this.health[EntityType.GIFT] = 30;
        this.health[EntityType.PENGUIN] = this.config.penguin_life ?? 320;
    }
}