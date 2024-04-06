export class IP {
    public address: string;
    public connectionAmount: number;
    public jps: number;
    public connectedThisTime: number;
    public packetsQty: number[];
    public banTime: number;
    public attempts: number;
    public constructor(address: string) {
        this.address = address;
        this.jps = 0;

        this.connectionAmount = 0;
        this.connectedThisTime = 0;
        this.packetsQty = [];
        this.attempts = 5;
        this.banTime = 0;
    }
}