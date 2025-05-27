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
}

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
View.prototype.fetchUpdate = function (event){
    const data = JSON.parse(event.data);
    if (data.type === "update" && data.chunks) {

    this.getBuffer().clear();

    data.chunks.forEach((chunk) => {
      const x = chunk.x + (this.width / 2);
      const y = chunk.y + (this.height / 2);
      if (x >= 0 && y >= 0) {
        if(!this.getBuffer().write(chunk.asset, x, y)){
            console.log("cannot write to the buffer!");
            return false;
        }
      }
    });
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
  return this.getBuffer().resize(width, height);
};
