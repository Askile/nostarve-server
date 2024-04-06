"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Account = void 0;
class Season {
    bestKill;
    bestScore;
    bestTime;
    time;
    kill;
    score;
    constructor() {
        this.bestKill = new Array(1).fill(0);
        this.bestScore = new Array(1).fill(0);
        this.bestTime = new Array(1).fill(0);
        this.time = 0;
        this.kill = 0;
        this.score = 0;
    }
}
class Account {
    skins;
    accessories;
    bags;
    books;
    crates;
    bread;
    kit;
    name;
    password;
    privateServer;
    privateServerTime;
    seasons;
    constructor(name, password) {
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
exports.Account = Account;
