import Player from "../../../entities/player";
import {Permissions} from "../../../enums/permissions";

export const identifiers = ["unban-ip"];
export const permission = Permissions.OWNER;
export function run(player: Player, args: string[], isServer: boolean) {
    const ip = args[0];
    const time = Number(args[1]);
    if(!ip || isNaN(time)) {
        return [false, "ban-ip [ip] [time]"];
    } else {
        const client = Array.from(this.server.wss.ips.values()).find((ip: any) => ip.address === ip) as any;
        if(client) {
            client.ban(time * 1000);
            return [false, `Player ${ip} banned for ${time}s.`];
        } else {
            return [false, `Player ${ip} not found.`];
        }
    }
}