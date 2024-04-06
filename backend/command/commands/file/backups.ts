import Player from "../../../entities/player";
import {Permissions} from "../../../enums/permissions";
import fs from "fs";
import FileUtils from "../../../modules/file.utils";

export const identifiers = ["backups"];
export const permission = Permissions.OWNER;
export function run(player: Player, args: string[], isServer: boolean) {
    let text = "";

    const backups = fs.readdirSync("./data/backups");
    for (let i = 0; i < backups.length; i++) {
        const backup = backups[i];

        text += i + " - " + backup + " " + FileUtils.getFolderSize("./data/backups/" + backup) + "<br>";
    }

    return [true, text];
}