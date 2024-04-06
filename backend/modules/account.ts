class Season {
    public bestKill: number[];
    public bestScore: number[];
    public bestTime: number[];
    public time: number;
    public kill: number;
    public score: number;
    constructor() {
        this.bestKill = new Array(1).fill(0);
        this.bestScore = new Array(1).fill(0);
        this.bestTime = new Array(1).fill(0);
        this.time = 0;
        this.kill = 0;
        this.score = 0;
    }
}

export class Account {
    public skins: number[];
    public accessories: number[];
    public bags: number[];
    public books: number[];
    public crates: number[];
    public bread: number;
    public kit: number;
    public name: string;
    public password: string;
    public privateServer: string;
    public privateServerTime: number;
    public seasons: Season[];

    constructor(name: string, password: string) {
        this.skins = new Array(175).fill(null);
        this.accessories = new Array(95).fill(null);
        this.bags = new Array(70).fill(null);
        this.books = new Array(40).fill(null);
        this.crates = new Array(72).fill(null);

        this.bread = 100;
        this.kit = 0;
        this.name = name;
        this.password = password;
        this.privateServer = "";
        this.privateServerTime = 0;
        this.seasons = [new Season()];
    }
}