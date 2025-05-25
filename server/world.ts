import { Component, Position } from "./components.ts";
import { Chunk, genChunk } from "./world_gen.ts";

export type Entity = Map<number, EntityData>;
export type Player = Map<number, EntityData >;

export type EntityData = {
    asset: string | string[],
    components: Set<Component>,
}
export interface System {
  requiredComponents: (new (...args: any[]) => Component)[];// Component types needed, e.g., ["position", "moving"]
  update: (entities: Entity | Player | undefined, world: World) => void;
}

export class World {
    world: Chunk = new Map();
    players: Player = new Map();
    render_radius: number = 1; // 3x3
    preload_radius: number = 2;
    systems: System[] = [];
    width: number = 0;
    height: number = 0;
    chunk_size: number = 16;
    updated_entities: Entity = new Map() ;

constructor() {
    this.resize(20, 20);
    this.initSystem(Position.createSystem()); // Use static method
    // this.initSystem(this.boundingBoxSystem());
    // this.initSystem(this.movingSystem());
    // this.initSystem(this.healthSystem());
    // this.initSystem(this.attackSystem());
    this.addPlayer();
    this.update(new Position(0, 100));
    }

  resize(width: number, height: number): void {
    this.width = width;
    this.height = height;
  }
  initSystem(system: System): void {
    this.systems.push(system);
  }
  addPlayer(){
    this.players.set(this.players.size + 1, { asset: '@', components: new Set<Component>().add(new Position(0, 0))});
  }
  update(player_pos: Position): boolean {
    if(this.players.size === 0)
        return false;

    const chunkx = Math.floor(player_pos.x / this.chunk_size);
    const chunky = Math.floor(player_pos.y / this.chunk_size);
    this.loadChunks(chunkx, chunky);

    // Update players
    for (const system of this.systems) {
        system.update(this.players, this); // updating the players
        system.update(this.world.get(player_pos.toKey()), this); // updating the World
    }

    // Update chunks in render radius
    for (let dx = -this.render_radius; dx <= this.render_radius; dx++) {
      for (let dy = -this.render_radius; dy <= this.render_radius; dy++) {
        const pos = new Position(chunkx + dx, chunky + dy);
        const chunk = this.world.get(pos.toKey());
        if (chunk) {
          for (const system of this.systems) {
            system.update(this.world.get(pos.toKey()), this);
          }
        }
      }
    }
    return true;
  }
  private loadChunks(chunkx: number, chunky: number): void {
      const newChunks = new Set<string>();

      for (let dx = -this.preload_radius; dx <= this.preload_radius; dx++) {
        for (let dy = -this.preload_radius; dy <= this.preload_radius; dy++) {
            const pos = new Position(chunkx + dx, chunky + dy);

          // Generate chunk if not loaded
          if (!this.world.has(pos.toKey())) {
            this.world.set(pos.toKey(), genChunk(pos.x, pos.y, this.chunk_size));
          }
          newChunks.add(`${pos.x},${pos.y}`);
        }
      }

      // Unload chunks outside preload radius
      for (const pos of this.world.keys()) {
          if (!newChunks.has(pos)) {
            this.world.delete(pos);
          }
        }
    }
}
