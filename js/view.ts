import { Buffer } from "./buffer.ts";
import { Viewport } from "./viewport.ts";

// Type for View properties
export interface View {
  width: number;
  height: number;
  buffer: Buffer;
  viewport: Viewport;
};


// View constructor
function View(this: View, width: number, height: number) {
  this.width = width;
  this.height = height;
  this.buffer = new Buffer(this);
  this.viewport = new Viewport(this, "main");
}

// View prototype method
View.prototype.render = function(this: View): void {
  this.viewport.createInstance();
  // fetching the cloned_buf tags and creating them.
  // rather than clearing the whole screen or overwriting constant elements like texts that haven't been modified,
  // only the modified regions should be overwritten.
};
