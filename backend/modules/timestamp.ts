export default class Timestamp {
    public createdAt: number;
    public time: number;
    constructor(time: number) {
        this.createdAt = Date.now();
        this.time = time;
    }

    public isFinished() {
        const finished = Date.now() - this.createdAt > this.time;

        if(finished) {
            this.createdAt = Date.now();
        }

        return finished;
    }
}