import Player from "../entities/player";
import {ItemType} from "../enums/types/item.type";
import {getDefaultMarket} from "../default/default.market";
import {Server} from "../server";

export default class Market {
    public orders: number[][];
    constructor(server: Server) {
        this.orders = getDefaultMarket();
        if(server.config.important.market) {
            this.orders = [];
            for (const order of server.config.important.market) {
                const priceId = (ItemType as any)[order[0].toUpperCase()];
                const priceAmount = order[1];
                const sellId = (ItemType as any)[order[2].toUpperCase()];
                const sellAmount = order[3];
                this.orders.push([priceId, priceAmount, sellId, sellAmount]);
            }
        }
    }

    /**
     * Buy an item from the market
     */
    public buy(player: Player, data: number[]) {
        if(!Number.isInteger(data[0]) && !Number.isInteger(data[1])) return;

        const count = Math.abs(Math.floor(data[0]));
        const id = Math.abs(Math.floor(data[1]));

        const item = this.orders[id];

        if (item && !player.inventory.contains(item[0], count)) return;

        player.inventory.increase(item[2], item[3] * (count / item[1]), true);
        player.inventory.decrease(item[0], count, true);
    }
}