import Building from "./building";
import Player from "../entities/player";
import {EntityType} from "../enums/types/entity.type";

export default class BuildingUtils {
    public static checkBuildingRequest(data: any) {
        return (
            data.length === 3 &&
            data[0] >= 0 &&
            data[1] >= 0 && data[1] <= 255 &&
            (data[2] === 1 || data[2] === 0)
        );
    }
    public static checkValid(player: Player, building: Building) {
        return true;
    }

    public static isDoor(type: EntityType) {
        return [
            EntityType.WOOD_DOOR, EntityType.STONE_DOOR, EntityType.GOLD_DOOR, EntityType.DIAMOND_DOOR, EntityType.AMETHYST_DOOR, EntityType.REIDITE_DOOR,
            EntityType.WOOD_DOOR_SPIKE, EntityType.STONE_DOOR_SPIKE, EntityType.GOLD_DOOR_SPIKE, EntityType.DIAMOND_DOOR_SPIKE, EntityType.AMETHYST_DOOR_SPIKE, EntityType.REIDITE_DOOR_SPIKE
        ].includes(type);
    }

    public static isDoorSpike(type: EntityType) {
        return [
            EntityType.WOOD_DOOR_SPIKE, EntityType.STONE_DOOR_SPIKE, EntityType.GOLD_DOOR_SPIKE, EntityType.DIAMOND_DOOR_SPIKE, EntityType.AMETHYST_DOOR_SPIKE, EntityType.REIDITE_DOOR_SPIKE
        ].includes(type);
    }

    public static isWall(type: EntityType) {
        return [
            EntityType.WOOD_SPIKE, EntityType.STONE_SPIKE, EntityType.GOLD_SPIKE, EntityType.DIAMOND_SPIKE, EntityType.AMETHYST_SPIKE, EntityType.REIDITE_SPIKE,
            EntityType.WOOD_WALL, EntityType.STONE_WALL, EntityType.GOLD_WALL, EntityType.DIAMOND_WALL, EntityType.AMETHYST_WALL, EntityType.REIDITE_WALL
        ].includes(type);
    }

    public static isSpike(type: EntityType) {
        return [
            EntityType.WOOD_SPIKE, EntityType.STONE_SPIKE, EntityType.GOLD_SPIKE, EntityType.DIAMOND_SPIKE, EntityType.AMETHYST_SPIKE, EntityType.REIDITE_SPIKE,
            EntityType.WOOD_DOOR_SPIKE, EntityType.STONE_DOOR_SPIKE, EntityType.GOLD_DOOR_SPIKE, EntityType.DIAMOND_DOOR_SPIKE, EntityType.AMETHYST_DOOR_SPIKE, EntityType.REIDITE_DOOR_SPIKE
        ].includes(type);
    }

    public static isExtractor(type: EntityType) {
        return [
            EntityType.STONE_EXTRACTOR, EntityType.GOLD_EXTRACTOR,
            EntityType.DIAMOND_EXTRACTOR, EntityType.AMETHYST_EXTRACTOR, EntityType.REIDITE_EXTRACTOR
        ].includes(type);
    }

    public static isSeed(type: EntityType) {
        return [
            EntityType.BERRY_SEED, EntityType.WHEAT_SEED, EntityType.CARROT_SEED, EntityType.TOMATO_SEED,
            EntityType.THORNBUSH_SEED, EntityType.GARLIC_SEED, EntityType.WATERMELON_SEED, EntityType.PUMPKIN_SEED
        ].includes(type);
    }

    public static isLight(type: EntityType) {
        return [
            EntityType.WOOD_WALL, EntityType.WOOD_SPIKE, EntityType.WOOD_DOOR, EntityType.WOOD_DOOR_SPIKE,
            EntityType.WORKBENCH, EntityType.TOTEM, EntityType.FIRE, EntityType.BIG_FIRE, EntityType.SIGN, EntityType.PLOT
        ].includes(type);
    }

    public static noCheck(type: EntityType) {
        return [
            EntityType.BRIDGE, EntityType.ROOF
        ].includes(type);
    }
}