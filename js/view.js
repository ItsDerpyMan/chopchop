import { Buffer } from "./buffer.js";
import { Viewport } from "./viewport.js";

/**
 * View holds every part of the rendering process.
 * @param {number} width
 * @param {number} height
 * @param {Viewport} viewport
 */
export function View(viewport, width, height) {
  this.width = width;
  this.height = height;
  this.buffer = new Buffer(width, height);
  this.viewport = viewport;
  this.camera = {x: 0, y: 0};
  this.avatar = [];
}
View.prototype.setAvatar = function(player){
    this.avatar = player.asset;
}
View.prototype.setPos = function (x, y){
    this.camera.x = x;
    this.camera.y = y;
};

/**
 * Calling this function flushes the buffer and draw the buffer content.
 */
View.prototype.render = function () {
  const element = this.viewport.getInstance();
  if (element == null) {
    return false;
  }
  element.innerHTML = this.getBuffer().flush();
  return true;
};
View.prototype.fetchUpdate = function (data){
    if (data.type === "update" && data.chunks) {

    this.getBuffer().clear();

    data.chunks.forEach((chunk) => {
      const x = Math.floor(0 + (chunk.x - this.camera.x));
      const y = Math.floor(this.height - (chunk.y - this.camera.y));
      const screen_x = Math.max(0, Math.min(this.width - 1, x));
      const screen_y = Math.max(0, Math.min(this.height - 1, y));
      if (x >= 0 && y >= 0) {
        if(!this.getBuffer().writeArray(chunk.asset, screen_x, screen_y)){
            console.log(`screen_pos: ${x}, ${y}`);
            console.log(`world_pos: ${chunk.x}, ${chunk.y}`)
            console.log("cannot write to the buffer!");
            return false;
        }
      }
    });
    this.getBuffer().write("@".repeat(this.width), 0, 0);
    this.getBuffer().write("@".repeat(this.width), 0, this.height - 1);
    for(let i = 0; i < this.height - 1; i++){
        this.getBuffer().write("@", 0, i);
        this.getBuffer().write("@", this.width - 1, i);
    }
    this.getBuffer().writeArray(this.avatar, (this.width / 2) + 1, (this.height / 2) + 2);
  }
  return true;
}
View.prototype.getBuffer = function () {
  return this.buffer;
};

View.prototype.getViewport = function () {
  return this.viewport;
};

View.prototype.resize = function (width, height) {
  this.width = width;
  this.height = height;
  return this.getBuffer().resize(width, height);
};
