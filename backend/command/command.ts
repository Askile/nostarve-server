import Player from "../entities/player";

export interface Command {
    identifiers: string[];
    run: (player: Player, args: string[], isServer: boolean) => [boolean, string];
    permission: number;
}