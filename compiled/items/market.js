"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const item_type_1 = require("../enums/types/item.type");
const default_market_1 = require("../default/default.market");
class Market {
    orders;
    constructor(server) {
        this.orders = (0, default_market_1.getDefaultMarket)();
        if (server.config.important.market) {
            this.orders = [];
            for (const order of server.config.important.market) {
                const priceId = item_type_1.ItemType[order[0].toUpperCase()];
                const priceAmount = order[1];
                const sellId = item_type_1.ItemType[order[2].toUpperCase()];
                const sellAmount = order[3];
                this.orders.push([priceId, priceAmount, sellId, sellAmount]);
            }
        }
    }
    /**
     * Buy an item from the market
     */
    buy(player, data) {
        if (!Number.isInteger(data[0]) && !Number.isInteger(data[1]))
            return;
        const count = Math.abs(Math.floor(data[0]));
        const id = Math.abs(Math.floor(data[1]));
        const item = this.orders[id];
        if (item && !player.inventory.contains(item[0], count))
            return;
        player.inventory.increase(item[2], item[3] * (count / item[1]), true);
        player.inventory.decrease(item[0], count, true);
    }
}
exports.default = Market;
