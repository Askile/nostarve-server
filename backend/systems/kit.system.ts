import {getDefaultKit} from "../default/default.kit";
import Player from "../entities/player";
import {ItemType} from "../enums/types/item.type";

export class KitSystem {
    private readonly kit: any[];
    public kits: Map<string, [string, number]>
    constructor(config: Config) {
        this.kit = getDefaultKit();
        this.kits = new Map();

        if(config.important.kits) {
            for (const privilege in config.important.kits) {
                const kit = config.important.kits[privilege];
                this.kits.set(privilege, kit);
            }
        }

        if(config.important.starter_kit.length > 0) {
            this.kit = config.important.starter_kit;
        }
    }

    public discordGainKit(player: Player, kitName: string) {
        const kit = this.kits.get(kitName);

        if(!kit) return;

        for (let i = 1; i < kit.length; i += 2) {
            const id = this.findInventoryId(kit[i] as string);
            const count = kit[i + 1] as number;
            player.inventory.increase(id, count, true);
        }
    }

    public gainKit(player: Player, kitName: string) {
        const now = Date.now();
        if(kitName === "starter") {
            for (const item of this.kit) {
                const name = item[0];
                const count = item[1];
                const id = this.findInventoryId(name);

                player.inventory.increase(id, count, true);
            }
        } else {
            const kit = this.kits.get(kitName);

            if(!kit) return;

            const timestamp = player.timestamps.get("kit_" + kitName);
            const cooldown = kit[0] as any;

            if (now - timestamp > cooldown * 60000) {
                // player.server.commandSystem.response(player, `Kit: ${kitName} gained`, true, "kit");
            } else {
                // player.server.commandSystem.response(player, "Cooldown: " + (cooldown - (now - timestamp) / 60000).toFixed(2) + "minutes", false, "kit");
                return;
            }

            for (let i = 1; i < kit.length; i += 2) {
                const id = this.findInventoryId(kit[i] as string);
                const count = kit[i + 1] as number;
                player.inventory.increase(id, count, true);
            }

            player.timestamps.set("kit_" + kitName, now);

        }

    }

    // public buy(player: Player, id: number) {
    //     if (!Number.isInteger(id)) return;
    //     const kit = this.getKit(id) as any;
    //     if(!kit) return;
    //
    //     let price = kit.shift();
    //     if ( player.tokenScore.score < price ) return;
    //
    //     player.tokenScore.score -= price;
    //     player.tokenScore.session_info = 1;
    //
    //     for (let i = 0; i < kit.length; i++ ) {
    //         let object = kit[i];
    //         player.inventory.giveItem(object[0], object[1]);
    //     }
    //
    //     player.ruinQuests();
    //
    //     player.client.sendU8([ClientPackets.KIT_OK, id]);
    //
    // }

    private findInventoryId(itemName: string) {
        return ItemType[itemName.toUpperCase() as "BAG"] as number;
    }
}