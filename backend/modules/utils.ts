import {EntityType} from "../enums/types/entity.type";
import {Vector} from "./vector";
import {ItemType} from "../enums/types/item.type";
import {Entity} from "../entities/entity";
import Building from "../building/building";
import {BinaryWriter} from "./binary.writer";
import Player from "../entities/player";
import {ClientPackets, ClientStringPackets} from "../enums/packets";

export class Utils {
    static arrows: number[] = [
        ItemType.DRAGON_ARROW, ItemType.REIDITE_ARROW, ItemType.AMETHYST_ARROW, ItemType.DIAMOND_ARROW,
        ItemType.GOLD_ARROW, ItemType.STONE_ARROW, ItemType.WOOD_ARROW, ItemType.FIREFLY
    ];
    static bows: number[] = [
        ItemType.DRAGON_BOW, ItemType.REIDITE_BOW, ItemType.AMETHYST_BOW, ItemType.DIAMOND_BOW,
        ItemType.GOLD_BOW, ItemType.STONE_BOW, ItemType.WOOD_BOW, ItemType.WAND2
    ];
    static generateRandomString(length: number) {
        let response = "";
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_+-";
        for (let i = 0; i < length; i++) {
            response += characters[~~(Math.random() * characters.length)];
        }

        return response;
    }

    static convertRecipe(r: any) {
        r.id = ItemType[r.item.toUpperCase()];
        r.r = r.recipe.map((rec: any) => [ItemType[rec[0].toUpperCase()], rec[1]]);
        r.w = r.workbench;
        delete r.workbench;
        delete r.item;
        delete r.recipe;
        return r;
    }

    static getAngleDifference(angle1: number, angle2: number) {
        let max = Math.PI * 2;
        let diff = (angle2 - angle1) % max;
        return Math.abs(2 * diff % max - diff);
    }

    static getTarget(self: Entity, entities: Entity[], distance: number = Infinity) {
        let minDist = Infinity;
        let target = null;
        
        for (const entity of entities) {
            if(entity === self) continue;

            const dist = self.realPosition.distance(entity.realPosition);
            if(dist < minDist && dist < distance) target = entity;
        }

        return target;
    }

    static getBuildings(entities: Entity[]) {
        let arr = [];
        
        for (const entity of entities) {
            if (entity && !(entity instanceof Building)) continue;
            arr.push(entity);
        }

        return arr;
    }

    static getArrowType(player: Player) {
        for (let i = 0; i < Utils.bows.length; i++) {
            const bow = Utils.bows[i];
            if(player.right.id === bow) {
                for (let j = i; j < Utils.arrows.length; j++) {
                    if(player.inventory.contains(Utils.arrows[j])) {
                        return [Utils.getSpell(Utils.arrows[j]), Utils.arrows[j]];
                    }
                }
            }
        }
        return -1;
    }

    static getSpell(bulletId: number) {
        switch (bulletId) {
            case ItemType.WOOD_ARROW: return 2;
            case ItemType.STONE_ARROW: return 3;
            case ItemType.GOLD_ARROW: return 4;
            case ItemType.DIAMOND_ARROW: return 5;
            case ItemType.AMETHYST_ARROW: return 6;
            case ItemType.REIDITE_ARROW: return 7;
            case ItemType.DRAGON_ARROW: return 8;
            case ItemType.FIREFLY: return 0;
            default:
                return -1;
        }
    }

    static random_clamp(min: number, max: number) {
        return Math.floor(min + Math.random() * (max + 1 - min));
    }

  
    static convertUintToAngle(angle: number) {
        return (((angle / 255) * Math.PI) * 2) + Math.PI / 2;
    }

    static distanceSqrt(v1: Vector, v2: Vector): number {
        const dx = v1.x - v2.x;
        const dy = v1.y - v2.y;
        return Math.sqrt(dx ** 2 + dy ** 2);
    }

    static getRandomFromArray(array: any[]) {
        return array[Math.floor(Math.random() * array.length)];
    }

    static isCirclesCollides(center1: Vector, radius1: number, center2: Vector, radius2: number): boolean {
        const distance = center1.distance(center2);
        return distance <= radius1 + radius2;
    }

    // @ts-ignore
    static getTreasure(chances: any, iteration = 0) {
        const randomValue = Math.randomClamp(0, 100);

        let current = 0;
        for (let i = 0; i < chances.length; i++) {
            const chance = chances[i];
            if(chance === 0) continue;

            if(current < randomValue && randomValue < current + chance) {
                return i;
            }

            current += chance;
        }

        if(iteration > 10) return ItemType.WOOD;
        return Utils.getTreasure(chances, iteration++);
    }
    
    static getShovelTreasure(chances: any) {
        const randomValue = Math.randomClamp(0, 100);

        let current = 0;
        for (let i = 0; i < chances.length; i++) {
            const chance = chances[i];

            if(current < randomValue && randomValue < current + chance) {
                return i;
            }

            current += chance;
        }

        return -1;
    }

    static getOffsetVector(v: Vector, distanceToMove: number, angle: number) {
        return v.add(
            new Vector(
                distanceToMove * Math.cos((angle / 255) * (Math.PI2)),
                distanceToMove * Math.sin((angle / 255) * (Math.PI2))
            )
        );
    }

    static getItemInStorage(type: EntityType) {
        switch(type) {
            case EntityType.STONE_EXTRACTOR: return ItemType.STONE;
            case EntityType.GOLD_EXTRACTOR: return ItemType.GOLD;
            case EntityType.DIAMOND_EXTRACTOR: return ItemType.DIAMOND;
            case EntityType.AMETHYST_EXTRACTOR: return ItemType.AMETHYST;
            case EntityType.REIDITE_EXTRACTOR: return ItemType.REIDITE;
            default: return -1;
        }
    }

    /* Packets */

    public static serializeAccountToBuffer(p: Player) {
        const writer = new BinaryWriter(7);

        writer.writeUInt8(ClientPackets.VERIFIED_ACCOUNT);
        writer.writeUInt8(p.id);
        writer.writeUInt8(p.cosmetics.skin);
        writer.writeUInt8(p.cosmetics.accessory);
        writer.writeUInt8(p.cosmetics.bag);
        writer.writeUInt8(p.cosmetics.book);
        writer.writeUInt8(p.level);

        return writer.toBuffer();
    }

    public static serializeCosmeticsToJSON(p: Player) {
        return JSON.stringify([
            ClientStringPackets.NEW_PLAYER,
            p.id,
            p.nickname,
            p.level,
            p.cosmetics.skin,
            p.cosmetics.accessory,
            p.cosmetics.bag,
            p.cosmetics.book
        ]);
    }

    public static lzwEncode(s: string) {
        let dict: any = {};
        let data = (s + "").split("");
        let out = [];
        let currChar;
        let phrase = data[0];
        let code = 256;
        for (let i = 1; i < data.length; i++) {
            currChar=data[i];
            if (dict[phrase + currChar] != null) {
                phrase += currChar;
            }
            else {
                out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
                dict[phrase + currChar] = code;
                code++;
                phrase=currChar;
            }
        }
        out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
        for (let i = 0; i < out.length; i++) {
            out[i] = String.fromCharCode(out[i]);
        }
        return out.join("");
    }

    public static lzwDecode(s: string) {
        let dict: any = {};
        let data = (s + "").split("");
        let currChar = data[0];
        let oldPhrase = currChar;
        let out = [currChar];
        let code = 256;
        let phrase;
        for (let i= 1 ; i < data.length; i++) {
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

    public static levenshteinDistance(str1: string, str2: string): number {
        const len1 = str1.length;
        const len2 = str2.length;

        const dp: number[][] = [];

        for (let i = 0; i <= len1; i++) {
            dp[i] = [];
            for (let j = 0; j <= len2; j++) {
                if (i === 0) {
                    dp[i][j] = j;
                } else if (j === 0) {
                    dp[i][j] = i;
                } else {
                    const substitutionCost = str1[i - 1] === str2[j - 1] ? 0 : 1;
                    dp[i][j] = Math.min(
                        dp[i - 1][j - 1] + substitutionCost,
                        dp[i - 1][j] + 1,
                        dp[i][j - 1] + 1
                    );
                }
            }
        }

        return dp[len1][len2];
    }

}