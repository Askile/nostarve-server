import Player from "../entities/player";
import {QuestReward, QuestScore, QuestState, QuestType} from "../enums/types/quest.type";
import {CachedPackets} from "../network/cached.packets";
import {ClientPackets} from "../enums/packets";

export class QuestSystem {
    public gainQuest(player: Player, type: QuestType) {
        if(!Number.isInteger(type) || player.quests[type] !== QuestState.SUCCEED) return;
        if(player.server.config.disable_quest || player.inventory.items.length === player.inventory.maxSize)
            return player.client.sendBinary(CachedPackets.get(ClientPackets.INV_FULL));
        if(QuestReward[type] === -1)
            player.inventory.maxSize += 1;
        else player.inventory.increase(QuestReward[type], 1, true);

        player.quests[type] = QuestState.CLAIMED;
        player.score += QuestScore[type];
        player.client.sendU8([ClientPackets.CLAIMED, type]);
    }

}