import Player from "../../../entities/player";
import {Permissions} from "../../../enums/permissions";
import fs from "fs";

export const identifiers = ["clean-backups"];
export const permission = Permissions.OWNER;
export function run(player: Player, args: string[], isServer: boolean) {
    const backups = fs.readdirSync("./data/backups");

    for (const backup of backups) {
        const src = "./data/backups/" + backup;

        fs.rmSync(src + "/crates.txt");
        fs.rmSync(src + "/players.txt");
        fs.rmSync(src + "/buildings.txt");

        fs.rmdirSync(src);
    }

    return [true, "Backups cleaned"];
}