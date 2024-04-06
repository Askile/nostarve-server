"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebSocketServer = void 0;
const uWS = __importStar(require("uWebSockets.js"));
const client_1 = require("./client");
const ip_1 = require("./ip");
const logger_1 = require("../modules/logger");
class WebSocketServer {
    server;
    clients = new Map();
    ips = new Map();
    app = uWS.App();
    constructor(server) {
        this.server = server;
        this.setupWebSocket();
    }
    setupWebSocket() {
        this.app.ws("/", {
            idleTimeout: 0,
            maxLifetime: 0,
            maxBackpressure: 1048576,
            maxPayloadLength: 1e6,
            upgrade: (res, req, context) => {
                res.upgrade({
                    ip: req.getHeader("cf-connecting-ip")
                }, req.getHeader('sec-websocket-key'), req.getHeader('sec-websocket-protocol'), req.getHeader('sec-websocket-extensions'), context);
            },
            open: this.handleWebSocketOpen.bind(this),
            message: this.handleWebSocketMessage.bind(this),
            close: this.handleWebSocketClose.bind(this)
        }).listen(this.server.port, () => {
            this.server.logger.log(`[Network] ${logger_1.CONSOLE_FORMATTERS.GREEN}WebSocket server is listening on port ${logger_1.CONSOLE_FORMATTERS.BLUE}${this.server.port}`);
        });
    }
    ipv4ByAddress(address) {
        const raw = address.split(":");
        const first_byte = parseInt(raw[6].slice(0, 2), 16);
        const second_byte = parseInt(raw[6].slice(2, 4), 16);
        const third_byte = parseInt(raw[7].slice(0, 2), 16);
        const fourth_byte = parseInt(raw[7].slice(2, 4), 16);
        return `${first_byte}.${second_byte}.${third_byte}.${fourth_byte}`;
    }
    handleWebSocketOpen(ws) {
        if (!this.server.loaded)
            return ws.close();
        const ipv6 = Buffer.from(ws.getRemoteAddressAsText()).toString();
        // @ts-ignore
        const ipv4 = ws.ip || this.ipv4ByAddress(ipv6);
        const ip = this.ips.get(ipv4);
        this.server.logger.log("[Network] Connected with " + ipv4 + " ip");
        if (ip) {
            if (ip.connectedThisTime > 10 || ip.jps > 4) {
                ws.close();
                return;
            }
            const client = new client_1.Client(ws, this.server, ip);
            ip.connectedThisTime++;
            ip.jps++;
            this.clients.set(ws, client);
            client.joinedAt = Date.now();
            client.onOpen();
        }
        else if (!ip) {
            const ip = new ip_1.IP(ipv4);
            this.ips.set(ipv4, ip);
            ip.connectedThisTime++;
            ip.jps++;
            const client = new client_1.Client(ws, this.server, ip);
            this.clients.set(ws, client);
            client.joinedAt = Date.now();
            client.onOpen();
        }
    }
    handleWebSocketMessage(ws, message, isBinary) {
        const client = this.clients.get(ws);
        if (client)
            client.onMessage(message, isBinary);
    }
    handleWebSocketClose(ws, code, message) {
        const client = this.clients.get(ws);
        if (client) {
            this.server.logger.log("[Network] Disconnected with " + client.ip.address + " ip " + code + " " + message);
            client.ip.connectedThisTime--;
            client.onClose();
        }
        this.clients.delete(ws);
    }
}
exports.WebSocketServer = WebSocketServer;
