import { chunks, hasComponent, World } from "./world.ts";
import { Position } from "./components.ts";
import { extname } from "https://deno.land/std/path/mod.ts";

const world = new World();
type serialized = {
  asset: string | string[];
  x: number;
  y: number;
  [key: string]: any;
};

async function handleRequest(req: Request): Promise<Response> {
  const url = new URL(req.url);

  if (req.headers.get("upgrade") === "websocket") {
    try {
      const { socket, response } = Deno.upgradeWebSocket(req);

      socket.onopen = () => {
        console.log("Client Connected");
        if (world.addPlayer(socket)) {
          world.update();
          const chunks = world.getChunks(socket);
          if (chunks) {
            socket.send(JSON.stringify({
              type: "update",
              chunks: serializeChunks(chunks, world),
            }));
          }
        } else {
          console.error("player-initalization failed");
        }
      };
      socket.onmessage = (event) => {
        const { x, y } = JSON.parse(event.data);
        const player = world.players.get(socket);
        console.log(`${"player"} coordinates: ${x}, ${y}`)
        if (player) {
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
        } else {
          console.error("failed to parse the chunks");
        }
      };

      socket.onclose = () => {
        console.log("Client disconnected");
        world.players.delete(socket);
        world.update();
      };
      socket.onerror = (error) => {
        console.error("Websocket error: ", error);
      };
      return response;
    } catch (error) {
      console.error("WebSocket upgrade failed:", error);
      return new Response("WebSocket upgrade failed", { status: 400 });
    }
  }
  if (url.pathname.startsWith("/.well-known/")) {
    return new Response("Not Found", { status: 404 });
  }
  let filePath = `.${url.pathname}`;
  if (url.pathname === "/") {
    filePath = "./index.html"; // Serve index.html for root
  } else if (url.pathname.startsWith("/js/")) {
    filePath = `.${url.pathname}`; // Serve JS files from /js/
  }

  try {
    const file = await Deno.readFile(filePath);
    const contentType = getContentType(filePath);
    return new Response(file, {
      headers: {
        "content-type": contentType,
        "cache-control": "no-cache", // Prevent caching for development
      },
    });
  } catch (error) {
    console.error(`File not found: ${filePath}`, error);
    return new Response("404 Not Found", { status: 404 });
  }
}

function getContentType(filePath: string): string {
  const ext = extname(filePath).toLowerCase();
  switch (ext) {
    case ".html":
      return "text/html";
    case ".js":
      return "application/javascript";
    case ".css":
      return "text/css";
    case ".png":
      return "image/png";
    case ".jpg":
      return "image/jpeg";
    case ".json":
      return "application/json";
    default:
      return "application/octet-stream";
  }
}

function serializeChunks(chunks: chunks, world: World): any[] {
  const arr: any[] = [];
  for (const [pos, data] of chunks.entries()) {
    const [chunkx, chunky] = pos.split(",").map(Number);
    for (let i = 0; i < data.length; i++) {
      const pos = data[i].components.get("position") as Position;
      if (!pos) {
        console.log("null chunk_pos");
      }
      let e: serialized = {
        asset: data[i].asset,
        x: chunkx * world.chunk_size + pos.x,
        y: chunky * world.chunk_size + pos.y,
      };
      for (const system of world.systems) {
        if (system.name.toString() != "position") {
          if (hasComponent(data[i], system.name)) {
            e[system.name] = data[i].components.get(system.name);
          }
        }
      }
      arr.push(e);
    }
  }
  return arr;
}

const server = Deno.serve({
  port: 8000,
  hostname: "0.0.0.0", // Listen on all interfaces
}, handleRequest);

console.log("Server running on http://localhost:8000 and ws://localhost:8000");

// Optional: Handle server shutdown gracefully
try {
  await server.finished;
} catch (error) {
  console.error("Server error:", error);
}
