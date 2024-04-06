import Player from "../../../entities/player";
import {Permissions} from "../../../enums/permissions";

export const identifiers = ["unban-ip"];
export const permission = Permissions.OWNER;
export function run(player: Player, args: string[], isServer: boolean) {
    const ip = args[0];

    if(!ip) {
        return [false, "unban-ip [ip]"];
    } else {
        const ip = Array.from(this.server.wss.ips.values()).find((ip: any) => ip.address === ip) as any;
        if(ip) {
            if(ip) {
                ip.banTime = 0;
            }
            return [false, `Player ${ip} unbanned.`];
        } else {
            return [false, `Player ${ip} not found.`];
        }
    }
}