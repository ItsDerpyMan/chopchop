const clients = new Set<WebSocket>();

async function handleRequest(req: Request): Response | Promise<Response> {
  if (req.headers.get("upgrade") !== "websocket") {
    return new Response(null, { status: 501 });
  }
  const { socket, response } = Deno.upgradeWebSocket(req);
  clients.add(socket);
  socket.onopen = () => {
    console.log("Client Connected");
    socket.send("hello");
  };
  socket.onmessage = (event) => {
    console.log("Received:", event.data);
    // Broadcast message to all clients
    for (const client of clients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(`Message: ${event.data}`);
      }
    }
  };
  socket.onclose = () => {
    console.log("Client disconnected");
  };
  socket.onerror = (error) => {
    console.error("Websocket error: ", error);
  };

  return response;
}

Deno.serve({ port: 8000 }, handleRequest);
console.log("Server running on ws://localhost:8000");
