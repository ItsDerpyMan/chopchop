import { Component, Position } from "./components.ts";
import { chunk, chunks, genChunk } from "./world_gen.ts";

export type Entity = Map<number, entityData>;
export type Player = Map<number, entityData>;

export type entityData = {
  asset: string | string[];
  components: Set<Component>;
};
function getPosition(entity: entityData): undefined | Position {
  if (entity.components.size === 0) {
    return undefined;
  }
  if (!entity.components.has(Position)) {
    return undefined;
  }
  return entity.components.values().find((c: Component) =>
    c instanceof Position
  );
}

export interface System {
  requiredComponents: (new (...args: any[]) => Component)[]; // Component types needed, e.g., ["position", "moving"]
  update: (chunk: chunk | Player | undefined, world: World) => void;
}

export class World {
  private world: chunks = new Map();
  private players: Player = new Map();
  private render_radius: number = 1; // 3x3
  private preload_radius: number = 2;
  private systems: System[] = [];
  private chunk_size: number = 16;

  constructor() {
    this.initSystem(Position.createSystem()); // Use static method
    // this.initSystem(this.boundingBoxSystem());
    // this.initSystem(this.movingSystem());
    // this.initSystem(this.healthSystem());
    // this.initSystem(this.attackSystem());
  }

  private initSystem(system: System): void {
    this.systems.push(system);
  }
  public addPlayer() {
    const new_player: entityData = {
       asset: '@' ,
       components: new Set<Component>([new Position(0, 0)])
    }
    this.players.set(this.players.size + 1, new_player);
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

  private getChunks(player_id: number): chunks | null{
        const d: entityData | undefined = this.players.get(player_id);
        if(!d)
            return null;

        const pos = d.components.values().find((c) => c instanceof Position) as Position;
        if(!pos)
            return null;

        const chunkx = Math.floor(pos.x / this.chunk_size);
        const chunky = Math.floor(pos.y / this.chunk_size);

        const chunks: chunks = new Map();
        for(let dx = 0; dx <= this.render_radius; dx++){
            for(let dy = 0; dy <= this.render_radius; dy++){
                const key = `${chunkx + dx},${chunky + dy}`
                const chunk = this.world.get(key);
                if(chunk) chunks.set(key, chunk);
            }
        }

        return chunks;
    }

  private loadChunks(): void {
    const chunks = new Set<string>();

    for (const [playerId, entityData] of this.players) {
      const position = entityData.components.values().find((c: Component) =>
        c instanceof Position
      ) as Position;
      if (!position) continue;

      const chunkX = Math.floor(position.x / this.chunk_size);
      const chunkY = Math.floor(position.y / this.chunk_size);

      for (let dx = -this.preload_radius; dx < this.preload_radius; dx++) {
        for (let dy = -this.preload_radius; dy < this.preload_radius; dy++) {
          const key = `${chunkX + dx},${chunkY + dy}`;
          chunks.add(key);
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
