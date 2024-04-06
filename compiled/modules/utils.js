"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Utils = void 0;
const entity_type_1 = require("../enums/types/entity.type");
const vector_1 = require("./vector");
const item_type_1 = require("../enums/types/item.type");
const building_1 = __importDefault(require("../building/building"));
const binary_writer_1 = require("./binary.writer");
const packets_1 = require("../enums/packets");
class Utils {
    static arrows = [
        item_type_1.ItemType.DRAGON_ARROW, item_type_1.ItemType.REIDITE_ARROW, item_type_1.ItemType.AMETHYST_ARROW, item_type_1.ItemType.DIAMOND_ARROW,
        item_type_1.ItemType.GOLD_ARROW, item_type_1.ItemType.STONE_ARROW, item_type_1.ItemType.WOOD_ARROW, item_type_1.ItemType.FIREFLY
    ];
    static bows = [
        item_type_1.ItemType.DRAGON_BOW, item_type_1.ItemType.REIDITE_BOW, item_type_1.ItemType.AMETHYST_BOW, item_type_1.ItemType.DIAMOND_BOW,
        item_type_1.ItemType.GOLD_BOW, item_type_1.ItemType.STONE_BOW, item_type_1.ItemType.WOOD_BOW, item_type_1.ItemType.WAND2
    ];
    static generateRandomString(length) {
        let response = "";
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_+-";
        for (let i = 0; i < length; i++) {
            response += characters[~~(Math.random() * characters.length)];
        }
        return response;
    }
    static convertRecipe(r) {
        r.id = item_type_1.ItemType[r.item.toUpperCase()];
        r.r = r.recipe.map((rec) => [item_type_1.ItemType[rec[0].toUpperCase()], rec[1]]);
        r.w = r.workbench;
        delete r.workbench;
        delete r.item;
        delete r.recipe;
        return r;
    }
    static getAngleDifference(angle1, angle2) {
        let max = Math.PI * 2;
        let diff = (angle2 - angle1) % max;
        return Math.abs(2 * diff % max - diff);
    }
    static getTarget(self, entities, distance = Infinity) {
        let minDist = Infinity;
        let target = null;
        for (const entity of entities) {
            if (entity === self)
                continue;
            const dist = self.realPosition.distance(entity.realPosition);
            if (dist < minDist && dist < distance)
                target = entity;
        }
        return target;
    }
    static getBuildings(entities) {
        let arr = [];
        for (const entity of entities) {
            if (entity && !(entity instanceof building_1.default))
                continue;
            arr.push(entity);
        }
        return arr;
    }
    static getArrowType(player) {
        for (let i = 0; i < Utils.bows.length; i++) {
            const bow = Utils.bows[i];
            if (player.right.id === bow) {
                for (let j = i; j < Utils.arrows.length; j++) {
                    if (player.inventory.contains(Utils.arrows[j])) {
                        return [Utils.getSpell(Utils.arrows[j]), Utils.arrows[j]];
                    }
                }
            }
        }
        return -1;
    }
    static getSpell(bulletId) {
        switch (bulletId) {
            case item_type_1.ItemType.WOOD_ARROW: return 2;
            case item_type_1.ItemType.STONE_ARROW: return 3;
            case item_type_1.ItemType.GOLD_ARROW: return 4;
            case item_type_1.ItemType.DIAMOND_ARROW: return 5;
            case item_type_1.ItemType.AMETHYST_ARROW: return 6;
            case item_type_1.ItemType.REIDITE_ARROW: return 7;
            case item_type_1.ItemType.DRAGON_ARROW: return 8;
            case item_type_1.ItemType.FIREFLY: return 0;
            default:
                return -1;
        }
    }
    static random_clamp(min, max) {
        return Math.floor(min + Math.random() * (max + 1 - min));
    }
    static convertUintToAngle(angle) {
        return (((angle / 255) * Math.PI) * 2) + Math.PI / 2;
    }
    static distanceSqrt(v1, v2) {
        const dx = v1.x - v2.x;
        const dy = v1.y - v2.y;
        return Math.sqrt(dx ** 2 + dy ** 2);
    }
    static getRandomFromArray(array) {
        return array[Math.floor(Math.random() * array.length)];
    }
    static isCirclesCollides(center1, radius1, center2, radius2) {
        const distance = center1.distance(center2);
        return distance <= radius1 + radius2;
    }
    // @ts-ignore
    static getTreasure(chances, iteration = 0) {
        const randomValue = Math.randomClamp(0, 100);
        let current = 0;
        for (let i = 0; i < chances.length; i++) {
            const chance = chances[i];
            if (chance === 0)
                continue;
            if (current < randomValue && randomValue < current + chance) {
                return i;
            }
            current += chance;
        }
        if (iteration > 10)
            return item_type_1.ItemType.WOOD;
        return Utils.getTreasure(chances, iteration++);
    }
    static getShovelTreasure(chances) {
        const randomValue = Math.randomClamp(0, 100);
        let current = 0;
        for (let i = 0; i < chances.length; i++) {
            const chance = chances[i];
            if (current < randomValue && randomValue < current + chance) {
                return i;
            }
            current += chance;
        }
        return -1;
    }
    static getOffsetVector(v, distanceToMove, angle) {
        return v.add(new vector_1.Vector(distanceToMove * Math.cos((angle / 255) * (Math.PI2)), distanceToMove * Math.sin((angle / 255) * (Math.PI2))));
    }
    static getItemInStorage(type) {
        switch (type) {
            case entity_type_1.EntityType.STONE_EXTRACTOR: return item_type_1.ItemType.STONE;
            case entity_type_1.EntityType.GOLD_EXTRACTOR: return item_type_1.ItemType.GOLD;
            case entity_type_1.EntityType.DIAMOND_EXTRACTOR: return item_type_1.ItemType.DIAMOND;
            case entity_type_1.EntityType.AMETHYST_EXTRACTOR: return item_type_1.ItemType.AMETHYST;
            case entity_type_1.EntityType.REIDITE_EXTRACTOR: return item_type_1.ItemType.REIDITE;
            default: return -1;
        }
    }
    /* Packets */
    static serializeAccountToBuffer(p) {
        const writer = new binary_writer_1.BinaryWriter(7);
        writer.writeUInt8(packets_1.ClientPackets.VERIFIED_ACCOUNT);
        writer.writeUInt8(p.id);
        writer.writeUInt8(p.cosmetics.skin);
        writer.writeUInt8(p.cosmetics.accessory);
        writer.writeUInt8(p.cosmetics.bag);
        writer.writeUInt8(p.cosmetics.book);
        writer.writeUInt8(p.level);
        return writer.toBuffer();
    }
    static serializeCosmeticsToJSON(p) {
        return JSON.stringify([
            packets_1.ClientStringPackets.NEW_PLAYER,
            p.id,
            p.nickname,
            p.level,
            p.cosmetics.skin,
            p.cosmetics.accessory,
            p.cosmetics.bag,
            p.cosmetics.book
        ]);
    }
    static lzwEncode(s) {
        let dict = {};
        let data = (s + "").split("");
        let out = [];
        let currChar;
        let phrase = data[0];
        let code = 256;
        for (let i = 1; i < data.length; i++) {
            currChar = data[i];
            if (dict[phrase + currChar] != null) {
                phrase += currChar;
            }
            else {
                out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
                dict[phrase + currChar] = code;
                code++;
                phrase = currChar;
            }
        }
        out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
        for (let i = 0; i < out.length; i++) {
            out[i] = String.fromCharCode(out[i]);
        }
        return out.join("");
    }
    static lzwDecode(s) {
        let dict = {};
        let data = (s + "").split("");
        let currChar = data[0];
        let oldPhrase = currChar;
        let out = [currChar];
        let code = 256;
        let phrase;
        for (let i = 1; i < data.length; i++) {
            let currCode = data[i].charCodeAt(0);
            if (currCode < 256) {
                phrase = data[i];
            }
            else {
                phrase = dict[currCode] ? dict[currCode] : (oldPhrase + currChar);
            }
            out.push(phrase);
            currChar = phrase.charAt(0);
            dict[code] = oldPhrase + currChar;
            code++;
            oldPhrase = phrase;
        }
        return out.join("");
    }
    static levenshteinDistance(str1, str2) {
        const len1 = str1.length;
        const len2 = str2.length;
        const dp = [];
        for (let i = 0; i <= len1; i++) {
            dp[i] = [];
            for (let j = 0; j <= len2; j++) {
                if (i === 0) {
                    dp[i][j] = j;
                }
                else if (j === 0) {
                    dp[i][j] = i;
                }
                else {
                    const substitutionCost = str1[i - 1] === str2[j - 1] ? 0 : 1;
                    dp[i][j] = Math.min(dp[i - 1][j - 1] + substitutionCost, dp[i - 1][j] + 1, dp[i][j - 1] + 1);
                }
            }
        }
        return dp[len1][len2];
    }
}
exports.Utils = Utils;
