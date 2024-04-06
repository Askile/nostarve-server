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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentManager = void 0;
const fs = __importStar(require("fs"));
const logger_1 = require("../modules/logger");
const item_type_1 = require("../enums/types/item.type");
const path_1 = __importDefault(require("path"));
const entity_type_1 = require("../enums/types/entity.type");
class ContentManager {
    server;
    // private interpreter: NoscriptInterpreter;
    constructor(server) {
        this.server = server;
        // this.interpreter = new NoscriptInterpreter(server);
        this.loadPackages();
    }
    softReadDir(dir) {
        const parts = dir.split("/");
        let path = "";
        for (let i = 0; i < parts.length; i++) {
            const newPart = parts.shift();
            if (!fs.existsSync(path + newPart + "/")) {
                this.server.logger.error(`[Content] ${logger_1.CONSOLE_FORMATTERS.RED}${logger_1.CONSOLE_FORMATTERS.BG_RED}Doesn't exist path: ${path}${logger_1.CONSOLE_FORMATTERS.UNDERLINE}${newPart}`);
                return [];
            }
            path += newPart + "/";
        }
        return fs.readdirSync(dir);
    }
    softReadFile(path, fileEncoding = "utf8") {
        if (!fs.existsSync(path)) {
            this.server.logger.error(`[Content] ${logger_1.CONSOLE_FORMATTERS.RED}${logger_1.CONSOLE_FORMATTERS.BG_RED}Doesn't exist path: ${path}`);
            return null;
        }
        return fs.readFileSync(path, { encoding: fileEncoding });
    }
    readEntities(contentName, entitiesPath, paths) {
        for (const unParsedPath of paths) {
            const parsedPath = path_1.default.parse(unParsedPath);
            const name = parsedPath.name;
            if (parsedPath.ext === ".json") {
                const config = this.softReadFile(entitiesPath + unParsedPath, "utf8");
                try {
                    const buildingDef = JSON.parse(config);
                    const id = entity_type_1.EntityType[name.toUpperCase()];
                    if (typeof id !== "number") {
                        this.server.logger.warn(`[Content] ${logger_1.CONSOLE_FORMATTERS.RESET}${logger_1.CONSOLE_FORMATTERS.BG_YELLOW}Skipped building ${name} invalid building because config not valid`);
                        return;
                    }
                    this.server.content.entities[id] = buildingDef;
                }
                catch (e) {
                    this.server.logger.warn(`[Content] ${logger_1.CONSOLE_FORMATTERS.RESET}${logger_1.CONSOLE_FORMATTERS.BG_YELLOW}Skipped building ${name} invalid building because config not valid`);
                }
            }
            else if (parsedPath.ext === "") {
                const newPath = entitiesPath + name + "/";
                const newPaths = this.softReadDir(newPath);
                this.readEntities(contentName, newPath, newPaths);
            }
        }
    }
    loadPackages() {
        const fileNames = this.softReadDir("./content");
        for (const fileName of fileNames) {
            this.server.logger.log(`[Content] ${logger_1.CONSOLE_FORMATTERS.MAGENTA}Loading ${fileName} content-pack`);
            const itemsFolder = this.softReadDir(`./content/${fileName}/items`);
            const entitiesFolder = this.softReadDir(`./content/${fileName}/entities`);
            const scriptsFolder = this.softReadDir(`./content/${fileName}/scripts`);
            const texturesFolder = this.softReadDir(`./content/${fileName}/textures`);
            if (itemsFolder.length !== 0 || entitiesFolder.length !== 0 ||
                scriptsFolder.length !== 0 || texturesFolder.length !== 0) {
                this.server.logger.log(`[Content]${logger_1.CONSOLE_FORMATTERS.GREEN} Loaded ${itemsFolder.length} items`);
                this.server.logger.log(`[Content]${logger_1.CONSOLE_FORMATTERS.GREEN} Loaded ${entitiesFolder.length} entities`);
                this.server.logger.log(`[Content]${logger_1.CONSOLE_FORMATTERS.GREEN} Loaded ${scriptsFolder.length} scripts`);
                this.server.logger.log(`[Content]${logger_1.CONSOLE_FORMATTERS.GREEN} Loaded ${texturesFolder.length} textures`);
            }
            for (const item of itemsFolder) {
                const config = this.softReadFile(`./content/${fileName}/items/${item}`, "utf8");
                const parsedPath = path_1.default.parse(item);
                try {
                    const itemDef = JSON.parse(config);
                    const id = item_type_1.ItemType[parsedPath.name.toUpperCase()];
                    if (typeof id !== "number") {
                        this.server.logger.warn(`[Content] ${logger_1.CONSOLE_FORMATTERS.RESET}${logger_1.CONSOLE_FORMATTERS.BG_YELLOW}Skipped item ${item} invalid item because config not valid`);
                        return;
                    }
                    this.server.content.items[id] = itemDef;
                }
                catch (e) {
                    this.server.logger.warn(`[Content] ${logger_1.CONSOLE_FORMATTERS.RESET}${logger_1.CONSOLE_FORMATTERS.BG_YELLOW}Skipped item ${item} invalid item because config not valid`);
                }
            }
            this.readEntities(fileName, `./content/${fileName}/entities/`, entitiesFolder);
            // for (const item of scriptsFolder) {
            //     const script = this.softReadFile(`./content/${fileName}/scripts/${item}`, "utf8");
            //
            //     // this.interpreter.interpret(script);
            //     this.server.logger.log(`[Content]${CONSOLE_FORMATTERS.GREEN} Loaded ${item} script`);
            // }
        }
    }
}
exports.ContentManager = ContentManager;
