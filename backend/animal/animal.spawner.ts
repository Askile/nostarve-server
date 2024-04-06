import {Server} from "../server";
import {EntityType} from "../enums/types/entity.type";
import Animal from "./animal";
import {BiomeType} from "../enums/types/biome.type";
import {Entity} from "../entities/entity";

export default class AnimalSpawner {
    public server: Server;
    private quantities: number[];
    constructor(server: Server) {
        this.server = server;
        this.quantities = Array(100).fill(0);
    }
    public tick() {
        this.spawnEntity(EntityType.WHEAT_MOB, this.server.config.max_wheat);
        this.spawnAnimal(EntityType.SPIDER, this.server.config.max_spider);
        this.spawnAnimal(EntityType.WOLF, this.server.config.max_wolf);
        this.spawnAnimal(EntityType.RABBIT, this.server.config.max_rabbit);
        this.spawnAnimal(EntityType.HAWK, this.server.config.max_hawk)
    }

    private spawnEntity(type: EntityType, max: number) {
        while (this.quantities[type] < max) {
            this.quantities[type]++;
            const entity = new Entity(type, this.server);
            const id = this.server.entityPool.generate();
            entity.id = id;
            entity.position = this.server.spawner.getSpawnPoint(BiomeType.FOREST, type);
            entity.realPosition.set(entity.position);
            this.server.entities[id] = entity;
        }
    }

    private spawnAnimal(type: EntityType, max: number) {
        while (this.quantities[type] < max) {
            this.quantities[type]++;
            const animal = new Animal(type, this.server);
            const id = this.server.entityPool.generate();
            animal.id = id;
            animal.position = this.server.spawner.getSpawnPoint(BiomeType.FOREST, type);
            animal.realPosition.set(animal.position);
            this.server.entities[id] = animal;
        }
    }
}