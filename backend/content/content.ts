import {Server} from "../server";


export class Content {
    private server: Server;
    public items: ItemDef[];
    public entities: any[];
    public scripts: any[];
    public textures: number[];
    constructor(server: Server) {
        this.server = server;
        this.items = [];
        this.entities = [];
        this.scripts = [];
        this.textures = [];
    }
}