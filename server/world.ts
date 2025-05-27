import { Component, Health, Position, System } from "./components.ts";
import { genChunk } from "./world_gen.ts";

export type Entity = Map<number, entityData>;
export type Player = Map<WebSocket, entityData>;
export type chunks = Map<string, chunk>;
export type chunk = entityData[];
export type entityData = {
  asset: string | string[];
  components: Map<string, Component>;
};

export function hasComponent(entity: entityData, component: string): boolean {
  return entity.components.has(component);
}

export class World {
  private world: chunks = new Map();
  public players: Player = new Map();
  private render_radius: number = 1; // 3x3
  private preload_radius: number = 2;
  public systems: System[] = [];
  public chunk_size: number = 16;

  constructor() {
    this.initSystem(Position.create());
    // this.initSystem(this.boundingBoxSystem());
    // this.initSystem(this.movingSystem());
    this.initSystem(Health.create());
    // this.initSystem(this.attackSystem());
  }

  private initSystem(system: System): void {
    this.systems.push(system);
  }

  public addPlayer(id: WebSocket): boolean {
    if (this.players.has(id)) {
      return false;
    }
    const new_player: entityData = {
      asset: "@",
      components: new Map([["position", new Position(0, 0)]]),
    };
    this.players.set(id, new_player);
    return true;
  }

  public update() {
    this.loadChunks();
    for (const [_, chunk] of this.world) {
      for (const system of this.systems) {
        system.update(chunk, this);
      }
    }
    for (const system of this.systems) {
      system.update(this.players, this);
    }
  }

  public getChunks(id: WebSocket): chunks | null {
    if (!this.players.has(id)) {
      return null;
    }
    const d: entityData | undefined = this.players.get(id);
    if (!d) {
      return null;
    }
    const pos = d.components.get("position") as Position;
    if (!pos) {
      return null;
    }
    const chunkx = Math.floor(pos.x / this.chunk_size);
    const chunky = Math.floor(pos.y / this.chunk_size);

    const chunks: chunks = new Map();
    for (let dx = 0; dx <= this.render_radius; dx++) {
      for (let dy = 0; dy <= this.render_radius; dy++) {
        const key = `${chunkx + dx},${chunky + dy}`;
        const chunk = this.world.get(key);
        if (chunk) chunks.set(key, chunk);
      }
    }

    return chunks;
  }

  private loadChunks(): void {
    const chunks = new Set<string>();

    for (const [_, entityData] of this.players) {
      const position = entityData.components.get("position") as Position;
      if (!position) {
        console.log("Player doesnot have position component");
      }
      const chunkX = Math.floor(position.x / this.chunk_size);
      const chunkY = Math.floor(position.y / this.chunk_size);

      for (let dx = -this.preload_radius; dx < this.preload_radius; dx++) {
        for (let dy = -this.preload_radius; dy < this.preload_radius; dy++) {
          const key = `${chunkX + dx},${chunkY + dy}`;
          chunks.add(key);
          console.log(`chunk: ${key}`);
          if (!this.world.has(key)) {
            this.world.set(
              key,
              genChunk(chunkX + dx, chunkY + dy, this.chunk_size),
            );
          }
        }
      }
    }

    for (const key of this.world.keys()) {
      if (!chunks.has(key)) {
        this.world.delete(key);
      }
    }
  }
}
