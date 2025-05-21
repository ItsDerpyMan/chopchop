import {Buffer } from "./buffer.js";
import {Viewport } from "./viewport.js";

// View constructor
/**
    * View holds every part of the rendering process.
    * @param {number} width
    * @param {number} height
    */
export function View(width, height) {
  this.width = width;
  this.height = height;
  this.buffer = new Buffer(width, height);
  this.viewport = new Viewport(this, "main");
}

// View prototype method
/**
    * Calling this function flushes the buffer and draw the buffer content.
    */
View.prototype.render = function(){
    const element = this.viewport.getInstance();
    if(element == null)
        return false;
    element.innerHTML = this.buffer.flush();
    return true;
  // fetching the cloned_buf tags and creating them.
  // rather than clearing the whole screen or overwriting constant elements like texts that haven't been modified,
  // only the modified regions should be overwritten.
};
