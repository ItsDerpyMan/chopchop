import { World, hasComponent, chunks } from "./world.ts";
import { Component, Position } from "./components.ts";

const world = new World();

type serialized = {
  asset: string | string[];
  x: number;
  y: number;
  [key: string]: any;
};

async function handleRequest(req: Request): Promise<Response> {
  if (req.headers.get("upgrade") !== "websocket") {
    return new Response(null, { status: 501 });
  }
  const { socket, response } = Deno.upgradeWebSocket(req);

  socket.onopen = () => {
    console.log("Client Connected");
    if(world.addPlayer(socket)){
        world.update();
        const chunks = world.getChunks(socket);
        if (chunks) {
            socket.send(JSON.stringify({
              type: "update",
              chunks: serializeChunks(chunks, world),
            }));
       }
    }
    console.error("player-initalization failed");
  };
  socket.onmessage = (event) => {
    const {x, y} = JSON.parse(event.data);
    const player = world.players.get(socket);
    if(player){
        const pos = player.components.get("position") as Position;
        pos.x = x;
        pos.y = y;
        world.update();
        const chunks = world.getChunks(socket);
        if (chunks) {
            socket.send(JSON.stringify({
              type: "update",
              chunks: serializeChunks(chunks, world),
            }));
        }
    }
    console.error("failed to parse the chunks");
  };

  socket.onclose = () => {
    console.log("Client disconnected");
    world.players.delete(socket);
    world.update();

    console.log(world.players);

  };
  socket.onerror = (error) => {
    console.error("Websocket error: ", error);
  };

  return response;
}

function serializeChunks(chunks: chunks, world: World): any[]{
    const arr: any[] = [];
    for(const [pos, data] of chunks.entries()){
        const [chunkx, chunky] = pos.split(',').map(Number);
        for(let i = 0; i < data.length; i++){
            const pos = data[i].components.get("position") as Position;
            if(!pos){
                console.log("null chunk_pos");
            }
            let e: serialized = {
                asset: data[i].asset,
                x: chunkx * world.chunk_size + pos.x,
                y: chunky * world.chunk_size + pos.y,
            }
            for(const system of world.systems){
                if(system.name.toString() != "position"){
                    if(hasComponent(data[i], system.name)){
                         e[system.name] = data[i].components.get(system.name);
                    }
                }
            }
            arr.push(e)
        }
    }
    return arr;
}

Deno.serve({ port: 8000 }, handleRequest);
console.log("Server running on ws://localhost:8000");
