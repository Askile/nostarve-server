"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Entity = void 0;
const vector_1 = require("../modules/vector");
const action_type_1 = require("../enums/types/action.type");
const entity_type_1 = require("../enums/types/entity.type");
class Entity {
    oldPosition;
    realPosition;
    position;
    velocity;
    server;
    components;
    createdAt = Date.now();
    biomes = [];
    state;
    speed;
    radius;
    health;
    damage;
    oldSpeed;
    oldAngle;
    oldAction;
    oldExtra;
    oldInfo;
    direction;
    type;
    id;
    pid;
    action;
    angle;
    extra;
    info;
    constructor(type, server) {
        this.server = server;
        this.type = type;
        this.id = 0;
        this.state = 0;
        this.components = new Map();
        if (this.server.content.entities[type]) {
            const entityDef = this.server.content.entities[type];
            if (entityDef.bool) {
                for (const component of entityDef.bool) {
                    this.setComponent(component, true);
                }
            }
            for (const [component, value] of Object.entries(entityDef)) {
                if (component === "bool")
                    continue;
                this.setComponent(component, value);
            }
        }
        this.health = this.server.configSystem.health[type];
        this.speed = this.getComponent("SPEED" /* ComponentType.SPEED */) ?? 0;
        this.damage = this.server.configSystem.entityDamage[type] ?? 0;
        this.radius = this.server.configSystem.entityRadius[type] ?? 0;
        this.oldPosition = vector_1.Vector.zero();
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
        this.realPosition = vector_1.Vector.zero();
        this.position = vector_1.Vector.zero();
        this.velocity = vector_1.Vector.zero();
    }
    hasComponent(component) {
        return this.components.has(component.toUpperCase());
    }
    getComponent(component) {
        return this.components.get(component.toUpperCase());
    }
    setComponent(component, value) {
        this.components.set(component.toUpperCase(), value);
    }
    removeComponent(component) {
        this.components.delete(component);
    }
    hasState(state) {
        return (this.state & state) === state;
    }
    addState(state) {
        if (!this.hasState(state)) {
            this.state += state;
        }
    }
    removeState(state) {
        this.state &= ~state;
    }
    toggleState(state) {
        if (this.hasState(state)) {
            this.state -= state;
        }
        else {
            this.state += state;
        }
    }
    hasAction(action) {
        return (this.action & action) === action;
    }
    addAction(action) {
        if (!this.hasAction(action)) {
            this.action += action;
        }
    }
    removeAction(action) {
        this.action &= ~action;
    }
    toggleAction(action) {
        if (this.hasAction(action)) {
            this.action -= action;
        }
        else {
            this.action += action;
        }
    }
    onDead(damager) {
        if (damager?.type === entity_type_1.EntityType.PLAYER) {
            if (this.hasComponent("ON_KILL" /* ComponentType.ON_KILL */)) {
                for (const command of this.getComponent("ON_KILL" /* ComponentType.ON_KILL */)) {
                    this.server.commandSystem.handleServerCommand(command, damager);
                }
            }
        }
    }
    onDamage(damager) { }
    onTick() { }
    updateSpeed() {
        this.speed = this.getComponent("speed");
    }
    delete() {
        this.action = action_type_1.ActionType.DELETE;
    }
    isUpdated() {
        return !this.oldPosition.equal(this.position) ||
            this.oldAction !== this.action ||
            this.oldAngle !== this.angle ||
            this.oldExtra !== this.extra ||
            this.oldInfo !== this.info;
    }
}
exports.Entity = Entity;
