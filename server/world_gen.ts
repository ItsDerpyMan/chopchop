import { RandomOptions, randomSeeded } from "@std/random";
import { randomIntegerBetween as rng } from "@std/random";

import { chunk, entityData } from "./world.ts";
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
const tree = readAsciiFile("tree");
const boulder = readAsciiFile("rock");

String.prototype.hashCode = function (): number {
  let hash = 5381;
  for (let i = 0; i < this.length; i++) {
    hash = (hash * 33) ^ this.charCodeAt(i);
  }
  return hash >>> 0;
};

export async function genChunk(
  chunkx: number,
  chunky: number,
  chunk_size: number,
): Promise<chunk> {
  const chunk: chunk = [];
  const seed = `${chunkx},${chunky}`.hashCode();
  const random = randomSeeded(BigInt(seed));
  const option: RandomOptions = { prng: () => random() };

  for (let i = 0; i < rng(0, 2, option); i++) {
    let x = rng(0, chunk_size - 1, option);
    let y = rng(0, chunk_size - 1, option);
    x = chunkx * chunk_size + x;
    y = chunky * chunk_size + y;
    const entityData: entityData = {
      asset: [await tree, await boulder][rng(0, 1, option)],
      components: new Map([["position", new Position(x, y)]]),
    };
    chunk.push(entityData);
  }
  return chunk;
}

export async function readAsciiFile(filename: string): Promise<string[]> {
  try {
    const path = `./server/ascii/${filename.endsWith('.txt') ? filename : filename + '.txt'}`;
    const content = await Deno.readTextFile(path);

    return content
      .split('\n')
      .map(line => line.replace(/\r$/, ''))
      .filter(line => line.trim() !== '');
  } catch (error) {
    console.error(`Error reading ASCII file ${filename}:`, error.message);
    return [];
  }
}
