import {Buffer } from "./buffer.js";
import {Viewport } from "./viewport.js";

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
View.prototype.render = function(){
    const element = this.viewport.getInstance();
    if(element == null)
        return false;
    element.innerHTML = this.getBuffer().flush();
    return true;
};
View.prototype.getBuffer = function() {
    return this.buffer;
};

View.prototype.getViewport = function(){
    return this.viewport;
};

View.prototype.resize = function(width, height){
    return this.getBuffer().resize(width, height);
}
