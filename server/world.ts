import { Component, Health, Position, System } from "./components.ts";
import { genChunk, readAsciiFile} from "./world_gen.ts";

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
  private render_width: number = 1;
  private render_height: number = 1
  public systems: System[] = [];
  public chunk_size: number = 16;

  constructor() {
    this.initSystem(Position.create());
    // this.initSystem(this.boundingBoxSystem());
    // this.initSystem(this.movingSystem());
    this.initSystem(Health.create());
    // this.initSystem(this.attackSystem());
  }
  public setSize(width: number, height: number): boolean{
        if(width < 0 || height < 0){
            return false;
        }
        this.render_height = height;
        this.render_width = width;
        return true;
    }
  private initSystem(system: System): void {
    this.systems.push(system);
  }

  public async addPlayer(id: WebSocket): Promise<boolean> {
    if (this.players.has(id)) {
      return false;
    }
    const avatar = async () => {
      try {
        return await readAsciiFile("avatar");
      } catch (error) {
        console.error('Error:', error.message);
        return "@";
      }
    };
    const new_player: entityData = {
      asset: await avatar(),
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
    for (let dx = 0; dx <= this.render_width; dx++) {
      for (let dy = 0; dy <= this.render_height; dy++) {
        const key = `${chunkx + dx},${chunky + dy}`;
        const chunk = this.world.get(key);
        if (chunk) chunks.set(key, chunk);
      }
    }
    return chunks;
  }

  private async loadChunks(): Promise<void> {
    const chunks = new Set<string>();

    for (const [_, player] of this.players) {
      const position = player.components.get("position") as Position;
      if (!position) {
        console.log("Player doesnot have position component");
      }
      const chunkX = Math.floor(position.x / this.chunk_size);
      const chunkY = Math.floor(position.y / this.chunk_size);

      for (let dx = -this.render_width; dx < this.render_width; dx++) {
        for (let dy = -this.render_height; dy < this.render_height; dy++) {
          const key = `${chunkX + dx},${chunkY + dy}`;
          chunks.add(key);
          if (!this.world.has(key)) {
            this.world.set(
              key,
              await genChunk(chunkX + dx, chunkY + dy, this.chunk_size),
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
