import {ItemType} from "./item.type";

export enum QuestType {
    DRAGON_ORB,
    DRAGON_CUBE,
    GREEN_GEM,
    ORANGE_GEM,
    BLUE_GEM,
    WINTER_PEASANT_FUR,
    WINTER_HOOD_FUR,
    LAVA_ORB,
    LAVA_CUBE,
    GOLDEN_PITCHFORK,
    PILOT_HAT,
    SLOT_1,
    SLOT_2
}

export const QuestReward: number[] = [];
QuestReward[QuestType.DRAGON_ORB] = ItemType.DRAGON_ORB;
QuestReward[QuestType.DRAGON_CUBE] = ItemType.DRAGON_CUBE;
QuestReward[QuestType.GREEN_GEM] = ItemType.GEM_GREEN;
QuestReward[QuestType.ORANGE_GEM] = ItemType.GEM_ORANGE;
QuestReward[QuestType.BLUE_GEM] = ItemType.GEM_BLUE;
QuestReward[QuestType.WINTER_HOOD_FUR] = ItemType.WINTER_HOOD_FUR;
QuestReward[QuestType.WINTER_PEASANT_FUR] = ItemType.WINTER_HOOD_FUR;
QuestReward[QuestType.LAVA_ORB] = ItemType.LAVA_ORB;
QuestReward[QuestType.LAVA_CUBE] = ItemType.LAVA_CUBE;
QuestReward[QuestType.GOLDEN_PITCHFORK] = ItemType.PITCHFORK_PART;
QuestReward[QuestType.PILOT_HAT] = ItemType.PILOT_GLASSES;
QuestReward[QuestType.SLOT_1] = -1;
QuestReward[QuestType.SLOT_2] = -1;

export const QuestScore: number[] = [];
QuestScore[QuestType.DRAGON_ORB] = 7500;
QuestScore[QuestType.DRAGON_CUBE] = 7500;
QuestScore[QuestType.GREEN_GEM] = 7500;
QuestScore[QuestType.ORANGE_GEM] = 3000;
QuestScore[QuestType.BLUE_GEM] = 7500;
QuestScore[QuestType.WINTER_HOOD_FUR] = 5000;
QuestScore[QuestType.WINTER_PEASANT_FUR] = 7500;
QuestScore[QuestType.LAVA_ORB] = 10000;
QuestScore[QuestType.LAVA_CUBE] = 7500;
QuestScore[QuestType.GOLDEN_PITCHFORK] = 7500;
QuestScore[QuestType.PILOT_HAT] = 5000;
QuestScore[QuestType.SLOT_1] = 10000;
QuestScore[QuestType.SLOT_2] = 10000;

export enum QuestState {
    FAILED,
    PROCCESS,
    SUCCEED,
    CLAIMED
}