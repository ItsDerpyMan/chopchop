import { randomSeeded } from "@std/random"
import { Entity, EntityData } from "./world.ts";
import { Position } from "./components.ts";

export type Chunk = Map<string, Entity>

const tree_gen: number = 10;
const rock_gen: number = 6;
const set_seed: bigint = 2n;

const chances: outcome<EntityData>[] = [
  { outcome: { asset: "|", components: new Set([{ type_name: "Position", data: { x: 0, y: 0 } }]) }, chance: tree_gen }, // Tree
  { outcome: { asset: "#", components: new Set([{ type_name: "Position", data: { x: 0, y: 0 } }]) }, chance: rock_gen }, // Rock
];

interface outcome<T>{
    outcome: T,
    chance: number,
}

function rollEntity<T>(outcomes: outcome<T>[], seed: bigint): T | null {
    const rng = randomSeeded(seed);
    let roll = rng() * 100;

    let cumulative = 0;
    for(const { outcome, chance } of outcomes) {
        cumulative += chance;
        if(roll <= cumulative){
            return outcome;
        }
    }
    return null
}
export function genChunk(chunkx: number, chunky: number, chunk_size: number): Entity {
    const seed = set_seed + BigInt(chunkx * 1000 + chunky);
    const entities: Entity = new Map();

    for (let i = 0; i < chunk_size; i++) {
        const entitySeed = seed + BigInt(i);
        const data  = rollEntity<EntityData>(chances, entitySeed);
        if (data != null) {
            const x = Math.floor(randomSeeded(entitySeed)() * chunk_size);
            const y = Math.floor(randomSeeded(entitySeed + 1n)() * chunk_size);
            const pos: Position = new Position(x, y)
            data.components = new Set([pos]);
            entities.set(i, data);
          };
        }

     return entities;
}
