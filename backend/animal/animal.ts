import {Entity} from "../entities/entity";
import {Server} from "../server";

export default class Animal extends Entity {
    constructor(type: number, server: Server) {
        super(type, server);
    }

    public onTick() {
    }
    

}