import { Viewport } from "./viewport.js";
import { View } from "./view.js";

const ws = new WebSocket("ws://localhost:8000");
let view = null;
const coords = { x: 0, y: 0 };

ws.onopen = (event) => {
  console.log("Connected to the server");
  const init = (() => {
    const viewport = new Viewport("container");
    const view_instance = new View(viewport, 100, 200);
    view = view_instance;
  })();

  console.log(view);
};
ws.onmessage = (event) => {
  const update = event.data;
  console.log(update);
};

ws.onerror = (event) => {
  console.error("Connection error: ", error);
};

function sendCoordinates() {
    if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(coords));
    console.log("Sent to server:", coords);
  } else {
    console.error("WebSocket not connected");
  }
}

document.addEventListener("keydown", (event) => {
  switch (event.key.toLowerCase()) {
    case "w":
      coords.y -= 1;
      break;
    case "a":
      coords.x -= 1;
      break;
    case "s":
      coords.y += 1;
      break;
    case "d":
      coords.x += 1;
      break;
  }
  sendCoordinates()
});
window.sendCoordinates = sendCoordinates;
