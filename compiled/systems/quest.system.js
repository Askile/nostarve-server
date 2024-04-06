"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestSystem = void 0;
const quest_type_1 = require("../enums/types/quest.type");
const cached_packets_1 = require("../network/cached.packets");
const packets_1 = require("../enums/packets");
class QuestSystem {
    gainQuest(player, type) {
        if (!Number.isInteger(type) || player.quests[type] !== quest_type_1.QuestState.SUCCEED)
            return;
        if (player.server.config.disable_quest || player.inventory.items.length === player.inventory.maxSize)
            return player.client.sendBinary(cached_packets_1.CachedPackets.get(packets_1.ClientPackets.INV_FULL));
        if (quest_type_1.QuestReward[type] === -1)
            player.inventory.maxSize += 1;
        else
            player.inventory.increase(quest_type_1.QuestReward[type], 1, true);
        player.quests[type] = quest_type_1.QuestState.CLAIMED;
        player.score += quest_type_1.QuestScore[type];
        player.client.sendU8([packets_1.ClientPackets.CLAIMED, type]);
    }
}
exports.QuestSystem = QuestSystem;
