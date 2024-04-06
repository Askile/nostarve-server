import {Server} from "../server";
import * as fs from "fs";
import {CONSOLE_FORMATTERS} from "../modules/logger";
import path from "path";
import {EntityType} from "../enums/types/entity.type";

export class ContentManager {
    private server: Server
    constructor(server: Server) {
        this.server = server;
        this.loadPackages();
    }

    private softReadDir(dir: string) {
        const parts = dir.split("/");
        let path = "";

        for (let i = 0; i < parts.length; i++) {
            const newPart = parts.shift();
            if (!fs.existsSync(path + newPart + "/")) {
                this.server.logger.error(`[Content] ${CONSOLE_FORMATTERS.RED}${CONSOLE_FORMATTERS.BG_RED}Doesn't exist path: ${path}${CONSOLE_FORMATTERS.UNDERLINE}${newPart}`);
                return [];
            }
            path += newPart + "/";
        }

        return fs.readdirSync(dir);
    }

    private softReadFile(path: string, fileEncoding: "utf8" | "utf-8" | "utf16le" | "ucs2" | "ucs-2" | "base64" | "latin1" | "binary" | "hex" = "utf8") {
        if (!fs.existsSync(path)) {
            this.server.logger.error(`[Content] ${CONSOLE_FORMATTERS.RED}${CONSOLE_FORMATTERS.BG_RED}Doesn't exist path: ${path}`);
            return null;
        }

        return fs.readFileSync(path, {encoding: fileEncoding});
    }

    private readEntities(contentName: string, entitiesPath: string, paths: string[]) {
        for (const unParsedPath of paths) {
            const parsedPath = path.parse(unParsedPath);
            const name = parsedPath.name;
            if(parsedPath.ext === ".json") {
                const config = this.softReadFile(entitiesPath + unParsedPath, "utf8");
                try {
                    const buildingDef = JSON.parse(config);
                    const id = EntityType[name.toUpperCase()];
                    if (typeof id !== "number") {
                        this.server.logger.warn(`[Content] ${CONSOLE_FORMATTERS.RESET}${CONSOLE_FORMATTERS.BG_YELLOW}Skipped building ${name} invalid building because config not valid`);
                        return;
                    }

                    this.server.content.entities[id] = buildingDef;
                } catch (e) {
                    this.server.logger.warn(`[Content] ${CONSOLE_FORMATTERS.RESET}${CONSOLE_FORMATTERS.BG_YELLOW}Skipped building ${name} invalid building because config not valid`);
                }
            } else if(parsedPath.ext === "") {
                const newPath = entitiesPath + name + "/";
                const newPaths = this.softReadDir(newPath);
                this.readEntities(contentName, newPath, newPaths);
            }
        }
    }


    public loadPackages() {
        const fileNames = this.softReadDir("./content");
        for (const fileName of fileNames) {
            this.server.logger.log(`[Content] ${CONSOLE_FORMATTERS.MAGENTA}Loading ${fileName} content-pack`);

            const entitiesFolder = this.softReadDir(`./content/${fileName}/entities`);

            if (
                entitiesFolder.length !== 0
            ) {
                this.server.logger.log(`[Content]${CONSOLE_FORMATTERS.GREEN} Loaded ${entitiesFolder.length} entities`);
            }

            this.readEntities(fileName, `./content/${fileName}/entities/`, entitiesFolder);
        }
    }
}