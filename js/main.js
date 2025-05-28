import { Viewport } from "./viewport.js";
import { View } from "./view.js";

const ws = new WebSocket("ws://localhost:8000");
const viewport = new Viewport("container");
const size = getScreenSize();
const view = new View(viewport, size[0], size[1]);
const camera = view.camera;

function getScreenSize(){
    let width = 0, height = 0;
    const char_width = 10, char_height = 20;
    width = Math.floor(window.innerWidth / char_width);
    height = Math.floor(window.innerHeight / char_height);
    return [ width, height];
}
function resize(){
    const size = getScreenSize();
    view.resize(size[0], size[1]);
    if(ws.readyState === WebSocket.OPEN){
        ws.send(JSON.stringify({type: 'resize', width: size[0], height: size[1]}));
        console.log("Resize: ", size);
    } else {
        console.log("WebSocket not connected");
    }
}
function sendPlayerCoordinates() {
    if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({type: 'coords', x: camera.x, y: camera.y}));
        console.log("Sent to server:", camera);
    } else {
        console.error("WebSocket not connected");
    }
}

window.sendCoordinates = function() {
  const x = parseFloat(document.getElementById("x-coord").value);
  const y = parseFloat(document.getElementById("y-coord").value);
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ x, y }));
    camera.x = x;
    camera.y = y;
  }
};

window.addEventListener('resize', resize);

ws.onopen = (event) => {
  resize();
  console.log("Connected to the server");
  console.log(view);
};
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  if(view.fetchUpdate(data)){
    view.render();
  }
  if(data.type === 'player'){
    view.setAvatar(data.player);
  }
};

ws.onerror = (event) => {
  console.error("Connection error: ", error);
};

document.addEventListener("keydown", (event) => {
  switch (event.key.toLowerCase()) {
    case "w":
      camera.y -= 1;
      break;
    case "a":
      camera.x -= 1;
      break;
    case "s":
      camera.y += 1;
      break;
    case "d":
      camera.x += 1;
      break;
  }
  sendPlayerCoordinates()
});
