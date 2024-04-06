import {createWriteStream, readFileSync, WriteStream} from "fs";
import fs from "fs";

/**
 * Console formatters.
 * @type {{BG_CYAN: string, BG_RED: string, BLUE: string, BG_BLUE: string, RESET: string, UNDERLINE: string, BOLD: string, DOUBLE_UNDERLINE: string, REVERSE: string, ITALIC: string, WHITE: string, BG_MAGENTA: string, DIM: string, GREEN: string, RED: string, INVISIBLE: string, OVERLINE: string, STRIKETHROUGH: string, BLINK: string, BG_YELLOW: string, MAGENTA: string, BG_GREEN: string, YELLOW: string, CYAN: string, BG_WHITE: string}}
 */
export const CONSOLE_FORMATTERS = {
    RESET: "\x1b[0m",
    BOLD: "\x1b[1m",
    DIM: "\x1b[2m",
    ITALIC: "\x1b[3m",
    UNDERLINE: "\x1b[4m",
    BLINK: "\x1b[5m",
    OVERLINE: "\x1b[6m",
    REVERSE: "\x1b[7m",
    INVISIBLE: "\x1b[8m",
    STRIKETHROUGH: "\x1b[9m",
    DOUBLE_UNDERLINE: "\x1b[21m",
    RED: "\x1b[31m",
    GREEN: "\x1b[32m",
    YELLOW: "\x1b[33m",
    BLUE: "\x1b[34m",
    MAGENTA: "\x1b[35m",
    CYAN: "\x1b[36m",
    WHITE: "\x1b[37m",
    BG_RED: "\x1b[41m",
    BG_GREEN: "\x1b[42m",
    BG_YELLOW: "\x1b[43m",
    BG_BLUE: "\x1b[44m",
    BG_MAGENTA: "\x1b[45m",
    BG_CYAN: "\x1b[46m",
    BG_WHITE: "\x1b[47m"
}

export interface LoggerConfig {
    discordWebhook?: string,
    title?: string,
    delay?: number,
    outputFile?: string,
    beforeExit?: (reason?: number) => undefined
}

export default class Logger {
    public title: string;
    public config: LoggerConfig;
    public logs: string[];
    public buffer: string;
    public lastActivity: number;
    public queue: string[];
    public delay: number;
    public interval: NodeJS.Timer;
    public stream: WriteStream | undefined;
    public timeStream: WriteStream | undefined;

    /**
     * @param config - Configuration for the logger.
     */
    constructor(config: LoggerConfig) {
        /**
         * Stack of log messages.
         * @type {string[]}
         */
        this.logs = [];
        this.config = config;
        /**
         * Title of the logger.
         * @type {string}
         */
        this.title = config.title ?? "Logger";
        /**
         * Last log activity.
         * @type {number}
         */
        this.lastActivity = Date.now();
        /**
         * Stack of log messages.
         * @type {string[]}
         */
        this.queue = [];
        /**
         * Delay in milliseconds.
         * @type {number}
         */
        this.delay = config.delay ?? 0;
        /**
         * IntervalID.
         * @type {undefined | number}
         */
        this.interval = undefined;
        /**
         * Write stream.
         * @type {undefined | WriteStream}
         */
        this.stream = undefined;
        /**
         * If config.outputFile is a path, create a write stream.
         */
        if (typeof config.outputFile === "string") {
            this.stream = createWriteStream(config.outputFile + "last.log");
            this.timeStream = createWriteStream(config.outputFile + new Date().toISOString().replace(/:/g, "-") + ".log");

            const files = fs.readdirSync("./data/logs");
            if(files.length > 25) {
                fs.rmSync("./data/logs/" + files[1]);
            }

        }

    }

    /**
     * Adds a fast log message to the queue.
     * @param {string} message
     */
    static fastLog(message) {
        /**
         * Add log message to queue.
         */
        console.log(
            CONSOLE_FORMATTERS.GREEN + "[" + new Date().toISOString() + "]",
            "[LOG]",
            message + CONSOLE_FORMATTERS.RESET
        );
    }
    /**
     * Sets up the interval.
     */
    #setupInterval() {
        /**
         * IntervalID.
         * @type {number}
         */
        this.interval = setInterval(() => {
            /**
             * If the queue is not empty, move the queue and log the message.
             */
            this.queue.length && this.#moveQueue();
        }, this.delay);
    }

    /**
     * Moves the queue and log the message.
     */
    #moveQueue() {
        /**
         * Get the message from the queue.
         */
        const [timestamp, type, message] = this.queue.splice(0, 3);
        const log = (timestamp + " " + type + " " + (typeof message === "object" ? JSON.stringify(message) : message)).replace(/\x1b\[\d+m/g, "") + "\n";
        /**
         * Log the message.
         */
        // console.log(timestamp + " " + type, message, CONSOLE_FORMATTERS.RESET);
        /**
         * If the output file is not empty, write the message to the file.
         */
        if (this.stream !== undefined) {
            this.stream.write(log);
            this.timeStream.write(log);
            this.buffer += log;
        }
        /**
         * Add log message to stack.
         */
        this.logs.push(log);
        /**
         * Update last activity.
         */
        this.lastActivity = Date.now();

        if(this.queue.length > 1000) {
            this.queue = [];
        }
    }

    /**
     * Adds a log message to the queue.
     * @param {string} message - The message to be logged.
     */
    public log(message: string) {
        const timestamp = CONSOLE_FORMATTERS.BLUE + CONSOLE_FORMATTERS.BOLD + "[" + new Date().toLocaleTimeString() + "]";
        /**
         * Add log message to queue.
         */
        this.queue.push(
            timestamp,
            "[LOG]",
            message + CONSOLE_FORMATTERS.RESET
        );
        /**
         * If the interval is undefined, setup interval.
         */
        this.interval === undefined && this.#setupInterval();
    }

    /**
     * Adds an error message to the queue.
     * @param {string} message - The error message to be added.
     */
    public error(message: string) {
        const timestamp = CONSOLE_FORMATTERS.RED + CONSOLE_FORMATTERS.BOLD + "[" + new Date().toLocaleTimeString() + "]";
        /**
         * Add log message to queue.
         */
        this.queue.push(
            timestamp,
            "[ERROR]",
            message + CONSOLE_FORMATTERS.RESET
        );
        /**
         * If the interval is undefined, setup interval.
         */
        this.interval === undefined && this.#setupInterval();
    }

    /**
     * Adds a warning message to the queue.
     * @param {string} message - The warning message to be added to the queue.
     */
    public warn(message: string) {
        const timestamp = CONSOLE_FORMATTERS.YELLOW + "[" + new Date().toLocaleTimeString() + "]";
        /**
         * Add log message to queue.
         */
        this.queue.push(
            timestamp,
            "[WARN]",
            message + CONSOLE_FORMATTERS.RESET
        );
        /**
         * If the interval is undefined, setup interval.
         */
        this.interval === undefined && this.#setupInterval();
    }
}