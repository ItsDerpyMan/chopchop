import { randomSeeded, RandomOptions } from "@std/random";
import { randomIntegerBetween as rng} from "@std/random";

import { entityData, chunk} from "./world.ts";
import { Position } from "./components.ts";
// - depricated
// const chances: outcome<entityData>[] = [
//   { outcome: { asset: "|", components: new Set([{ type_name: "Position", data: { x: 0, y: 0 } }]) }, chance: tree_gen }, // Tree
//   { outcome: { asset: "o", components: new Set([{ type_name: "Position", data: { x: 0, y: 0 } }]) }, chance: rock_gen }, // Rock
// ];
//
// interface outcome<T>{
//     outcome: T,
//     chance: number,
// }
// - depricated
// function rollEntity<T>(outcomes: outcome<T>[], seed: bigint): T | null {
//     const rng = randomSeeded(seed);
//     let roll = rng() * 100;
//
//     let cumulative = 0;
//     for(const { outcome, chance } of outcomes) {
//         cumulative += chance;
//         if(roll <= cumulative){
//             return outcome;
//         }
//     }
//     return null
// }

String.prototype.hashCode = function (): number {
  let hash = 5381;
  for (let i = 0; i < this.length; i++) {
    hash = (hash * 33) ^ this.charCodeAt(i);
  }
  return hash >>> 0;
};

export function genChunk(
  chunkx: number,
  chunky: number,
  chunk_size: number,
): chunk {
  const chunk: chunk = [];
  const seed = `${chunkx},${chunky}`.hashCode();
  console.log(seed);
  const random = randomSeeded(BigInt(seed));
  const option: RandomOptions = { prng: () => random() };

  for (let i = 0; i < rng(5, 10, option); i++) {
    const x = rng(0, chunk_size - 1, option);
    const y = rng(0, chunk_size - 1, option);
    const entityData: entityData = {
      asset: ["|", "o"][rng(0, 1, option)],
      components: new Map([[ "position", new Position(x, y) ]]),
    };
    chunk.push(entityData);
  }
  return chunk;
}
