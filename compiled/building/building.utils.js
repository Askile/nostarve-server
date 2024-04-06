"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const entity_type_1 = require("../enums/types/entity.type");
class BuildingUtils {
    static checkBuildingRequest(data) {
        return (data.length === 3 &&
            data[0] >= 0 &&
            data[1] >= 0 && data[1] <= 255 &&
            (data[2] === 1 || data[2] === 0));
    }
    static checkValid(player, building) {
        return true;
    }
    static isDoor(type) {
        return [
            entity_type_1.EntityType.WOOD_DOOR, entity_type_1.EntityType.STONE_DOOR, entity_type_1.EntityType.GOLD_DOOR, entity_type_1.EntityType.DIAMOND_DOOR, entity_type_1.EntityType.AMETHYST_DOOR, entity_type_1.EntityType.REIDITE_DOOR,
            entity_type_1.EntityType.WOOD_DOOR_SPIKE, entity_type_1.EntityType.STONE_DOOR_SPIKE, entity_type_1.EntityType.GOLD_DOOR_SPIKE, entity_type_1.EntityType.DIAMOND_DOOR_SPIKE, entity_type_1.EntityType.AMETHYST_DOOR_SPIKE, entity_type_1.EntityType.REIDITE_DOOR_SPIKE
        ].includes(type);
    }
    static isDoorSpike(type) {
        return [
            entity_type_1.EntityType.WOOD_DOOR_SPIKE, entity_type_1.EntityType.STONE_DOOR_SPIKE, entity_type_1.EntityType.GOLD_DOOR_SPIKE, entity_type_1.EntityType.DIAMOND_DOOR_SPIKE, entity_type_1.EntityType.AMETHYST_DOOR_SPIKE, entity_type_1.EntityType.REIDITE_DOOR_SPIKE
        ].includes(type);
    }
    static isWall(type) {
        return [
            entity_type_1.EntityType.WOOD_SPIKE, entity_type_1.EntityType.STONE_SPIKE, entity_type_1.EntityType.GOLD_SPIKE, entity_type_1.EntityType.DIAMOND_SPIKE, entity_type_1.EntityType.AMETHYST_SPIKE, entity_type_1.EntityType.REIDITE_SPIKE,
            entity_type_1.EntityType.WOOD_WALL, entity_type_1.EntityType.STONE_WALL, entity_type_1.EntityType.GOLD_WALL, entity_type_1.EntityType.DIAMOND_WALL, entity_type_1.EntityType.AMETHYST_WALL, entity_type_1.EntityType.REIDITE_WALL
        ].includes(type);
    }
    static isSpike(type) {
        return [
            entity_type_1.EntityType.WOOD_SPIKE, entity_type_1.EntityType.STONE_SPIKE, entity_type_1.EntityType.GOLD_SPIKE, entity_type_1.EntityType.DIAMOND_SPIKE, entity_type_1.EntityType.AMETHYST_SPIKE, entity_type_1.EntityType.REIDITE_SPIKE,
            entity_type_1.EntityType.WOOD_DOOR_SPIKE, entity_type_1.EntityType.STONE_DOOR_SPIKE, entity_type_1.EntityType.GOLD_DOOR_SPIKE, entity_type_1.EntityType.DIAMOND_DOOR_SPIKE, entity_type_1.EntityType.AMETHYST_DOOR_SPIKE, entity_type_1.EntityType.REIDITE_DOOR_SPIKE
        ].includes(type);
    }
    static isExtractor(type) {
        return [
            entity_type_1.EntityType.STONE_EXTRACTOR, entity_type_1.EntityType.GOLD_EXTRACTOR,
            entity_type_1.EntityType.DIAMOND_EXTRACTOR, entity_type_1.EntityType.AMETHYST_EXTRACTOR, entity_type_1.EntityType.REIDITE_EXTRACTOR
        ].includes(type);
    }
    static isSeed(type) {
        return [
            entity_type_1.EntityType.BERRY_SEED, entity_type_1.EntityType.WHEAT_SEED, entity_type_1.EntityType.CARROT_SEED, entity_type_1.EntityType.TOMATO_SEED,
            entity_type_1.EntityType.THORNBUSH_SEED, entity_type_1.EntityType.GARLIC_SEED, entity_type_1.EntityType.WATERMELON_SEED, entity_type_1.EntityType.PUMPKIN_SEED
        ].includes(type);
    }
    static isLight(type) {
        return [
            entity_type_1.EntityType.WOOD_WALL, entity_type_1.EntityType.WOOD_SPIKE, entity_type_1.EntityType.WOOD_DOOR, entity_type_1.EntityType.WOOD_DOOR_SPIKE,
            entity_type_1.EntityType.WORKBENCH, entity_type_1.EntityType.TOTEM, entity_type_1.EntityType.FIRE, entity_type_1.EntityType.BIG_FIRE, entity_type_1.EntityType.SIGN, entity_type_1.EntityType.PLOT
        ].includes(type);
    }
    static noCheck(type) {
        return [
            entity_type_1.EntityType.BRIDGE, entity_type_1.EntityType.ROOF
        ].includes(type);
    }
}
exports.default = BuildingUtils;
