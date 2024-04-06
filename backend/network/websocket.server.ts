import * as uWS from "uWebSockets.js";
import {WebSocket} from "uWebSockets.js";
import {Client} from "./client";
import {Server} from "../server";
import {IP} from "./ip";
import {CONSOLE_FORMATTERS} from "../modules/logger";

export class WebSocketServer {
    private readonly server: Server;
    public clients: Map<WebSocket<any>, Client> = new Map();
    public ips: Map<string, IP> = new Map();
    public app: uWS.TemplatedApp = uWS.App();

    constructor(server: Server) {
        this.server = server;

        this.setupWebSocket();
    }

    private setupWebSocket() {
        this.app.ws("/", {
            idleTimeout: 0,
            maxLifetime: 0,
            maxBackpressure: 1048576,
            maxPayloadLength: 1e6,
            upgrade: (res, req, context) => {
                res.upgrade({
                        ip: req.getHeader("cf-connecting-ip")
                    },
                    req.getHeader('sec-websocket-key'),
                    req.getHeader('sec-websocket-protocol'),
                    req.getHeader('sec-websocket-extensions'),
                    context);
            },
            open: this.handleWebSocketOpen.bind(this),
            message: this.handleWebSocketMessage.bind(this),
            close: this.handleWebSocketClose.bind(this)
        }).listen(this.server.port, () => {
            this.server.logger.log(`[Network] ${CONSOLE_FORMATTERS.GREEN}WebSocket server is listening on port ${CONSOLE_FORMATTERS.BLUE}${this.server.port}`);
        });
    }

    private ipv4ByAddress(address: string) {
        const raw = address.split(":");
        const first_byte = parseInt(raw[6].slice(0, 2), 16);
        const second_byte = parseInt(raw[6].slice(2, 4), 16);
        const third_byte = parseInt(raw[7].slice(0, 2), 16);
        const fourth_byte = parseInt(raw[7].slice(2, 4), 16);
        return `${first_byte}.${second_byte}.${third_byte}.${fourth_byte}`;
    }

    private handleWebSocketOpen(ws: uWS.WebSocket<any>) {
        if(!this.server.loaded) return ws.close();

        const ipv6 = Buffer.from(ws.getRemoteAddressAsText()).toString();
        // @ts-ignore
        const ipv4 = ws.ip || this.ipv4ByAddress(ipv6);
        const ip = this.ips.get(ipv4) as IP;
        this.server.logger.log("[Network] Connected with " + ipv4 + " ip");

        if(ip) {
            if(ip.connectedThisTime > 10 || ip.jps > 4) {
                ws.close();
                return;
            }

            const client = new Client(ws, this.server, ip);

            ip.connectedThisTime++;
            ip.jps++;

            this.clients.set(ws, client);

            client.joinedAt = Date.now();
            client.onOpen();
        } else if(!ip) {
            const ip = new IP(ipv4);
            this.ips.set(ipv4, ip);

            ip.connectedThisTime++;
            ip.jps++;

            const client = new Client(ws, this.server, ip);

            this.clients.set(ws, client);

            client.joinedAt = Date.now();
            client.onOpen();
        }
    }

    private handleWebSocketMessage(ws: uWS.WebSocket<any>, message: ArrayBuffer, isBinary: boolean) {
        const client = this.clients.get(ws);
        if (client) client.onMessage(message, isBinary);
    }

    private handleWebSocketClose(ws: uWS.WebSocket<any>, code: number, message: any) {
        const client = this.clients.get(ws) as Client;
        if(client) {
            this.server.logger.log("[Network] Disconnected with " + client.ip.address + " ip " + code + " " + message);

            client.ip.connectedThisTime--;
            client.onClose();
        }
        this.clients.delete(ws);
    }

}