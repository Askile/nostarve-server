"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const entity_type_1 = require("../enums/types/entity.type");
const animal_1 = __importDefault(require("./animal"));
const biome_type_1 = require("../enums/types/biome.type");
const entity_1 = require("../entities/entity");
class AnimalSpawner {
    server;
    quantities;
    constructor(server) {
        this.server = server;
        this.quantities = Array(100).fill(0);
    }
    tick() {
        this.spawnEntity(entity_type_1.EntityType.WHEAT_MOB, this.server.config.max_wheat);
        this.spawnAnimal(entity_type_1.EntityType.SPIDER, this.server.config.max_spider);
        this.spawnAnimal(entity_type_1.EntityType.WOLF, this.server.config.max_wolf);
        this.spawnAnimal(entity_type_1.EntityType.RABBIT, this.server.config.max_rabbit);
        this.spawnAnimal(entity_type_1.EntityType.HAWK, this.server.config.max_hawk);
    }
    spawnEntity(type, max) {
        while (this.quantities[type] < max) {
            this.quantities[type]++;
            const entity = new entity_1.Entity(type, this.server);
            const id = this.server.entityPool.generate();
            entity.id = id;
            entity.position = this.server.spawner.getSpawnPoint(biome_type_1.BiomeType.FOREST, type);
            entity.realPosition.set(entity.position);
            this.server.entities[id] = entity;
        }
    }
    spawnAnimal(type, max) {
        while (this.quantities[type] < max) {
            this.quantities[type]++;
            const animal = new animal_1.default(type, this.server);
            const id = this.server.entityPool.generate();
            animal.id = id;
            animal.position = this.server.spawner.getSpawnPoint(biome_type_1.BiomeType.FOREST, type);
            animal.realPosition.set(animal.position);
            this.server.entities[id] = animal;
        }
    }
}
exports.default = AnimalSpawner;
