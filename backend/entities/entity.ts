import {Vector} from "../modules/vector";
import {Server} from "../server";
import {ActionType} from "../enums/types/action.type";
import {Biome} from "../world/biome";
import {EntityType} from "../enums/types/entity.type";
import {ComponentType} from "../enums/types/component.type";
import Player from "./player";

export class Entity {
    public oldPosition: Vector;
    public realPosition: Vector;
    public position: Vector;
    public velocity: Vector;
    public server: Server;

    public components: Map<string, any>;

    public createdAt: number = Date.now();

    public biomes: Biome[] = [];

    public state: number;

    public speed: number;
    public radius: number;
    public health: number;
    public damage: number;
    public oldSpeed: number;
    public oldAngle: number;
    public oldAction: number;
    public oldExtra: number;
    public oldInfo: number;
    public direction: number;
    public type: EntityType;

    public id: number;
    public pid: number;
    public action: number;
    public angle: number;
    public extra: number;
    public info: number;

    constructor(type: number, server: Server) {
        this.server = server;
        this.type = type;
        this.id = 0;

        this.state = 0;
        this.components = new Map();

        if(this.server.content.entities[type]) {
            const entityDef = this.server.content.entities[type];

            if(entityDef.bool) {
                for (const component of entityDef.bool) {
                    this.setComponent(component as ComponentType, true);
                }
            }

            for (const [component, value] of Object.entries(entityDef)) {
                if(component === "bool") continue;

                this.setComponent(component as ComponentType, value);
            }
        }

        this.health = this.server.configSystem.health[type];

        this.speed = this.getComponent(ComponentType.SPEED) ?? 0;
        this.damage = this.server.configSystem.entityDamage[type] ?? 0;
        this.radius = this.server.configSystem.entityRadius[type] ?? 0;

        this.oldPosition = Vector.zero();
        this.oldAngle = 0;
        this.oldAction = 0;
        this.oldSpeed = 0;
        this.oldExtra = 0;
        this.oldInfo = 0;

        this.pid = 0;
        this.angle = 0;
        this.action = 0;
        this.info = 0;
        this.extra = 0;

        this.direction = 0;

        this.realPosition = Vector.zero();
        this.position = Vector.zero();
        this.velocity = Vector.zero();
    }

    public hasComponent(component: string) {
        return this.components.has(component.toUpperCase());
    }

    public getComponent(component: string) {
        return this.components.get(component.toUpperCase());
    }

    public setComponent(component: string, value: any) {
        this.components.set(component.toUpperCase(), value);
    }

    public removeComponent(component: ComponentType) {
        this.components.delete(component);
    }

    public hasState(state: number) {
        return (this.state & state) === state;
    }

    public addState(state: number) {
        if(!this.hasState(state)) {
            this.state += state;
        }
    }

    public removeState(state: number) {
        this.state &= ~state;
    }

    public toggleState(state: number) {
        if(this.hasState(state)) {
            this.state -= state;
        } else {
            this.state += state;
        }
    }

    public hasAction(action: number) {
        return (this.action & action) === action;
    }

    public addAction(action: number) {
        if(!this.hasAction(action)) {
            this.action += action;
        }
    }

    public removeAction(action: number) {
        this.action &= ~action;
    }

    public toggleAction(action: number) {
        if(this.hasAction(action)) {
            this.action -= action;
        } else {
            this.action += action;
        }
    }

    public onDead(damager?: Entity) {
        if(damager?.type === EntityType.PLAYER) {
            if(this.hasComponent(ComponentType.ON_KILL)) {
                for (const command of this.getComponent(ComponentType.ON_KILL)) {
                    this.server.commandSystem.handleServerCommand(command, damager as Player);
                }
            }
        }
    }
    public onDamage(damager?: Entity) {}
    public onTick() {}
    public updateSpeed() {
        this.speed = this.getComponent("speed");
    }

    public delete() {
        this.action = ActionType.DELETE;
    }

    public isUpdated() {
        return !this.oldPosition.equal(this.position) ||
                this.oldAction !== this.action ||
                this.oldAngle !== this.angle ||
                this.oldExtra !== this.extra ||
                this.oldInfo !== this.info;
    }

}
