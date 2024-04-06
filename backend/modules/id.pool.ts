export class IdPool {
    public startId: number;
    public used: boolean[];
    public constructor(startId: number) {
        this.startId = startId;
        this.used = [];
    }

    public generate() {
        let i = this.startId;

        while (this.used[++i] === true) {}

        this.used[i] = true;
        return i;
    }
    public free(id: number) {
        this.used[id] = false;
    }

}