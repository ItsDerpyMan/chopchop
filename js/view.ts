import { buffer, Buffer } from "./buffer.ts";
import { viewport, Viewport } from "./viewport.ts";

// Type for View properties
export type View = {
  new(width: number, height: number): View;
  width: number;
  height: number;
  buffer: Buffer;
  viewport: Viewport;
  render(this: View): boolean;
};


// View constructor
function View(this: View, width: number, height: number) {
  this.width = width;
  this.height = height;
  this.buffer = new buffer(this);
  this.viewport = new viewport(this, "main");
}

// View prototype method
View.prototype.render = function(this: View): boolean {
    const element = this.viewport.getInstance();
    if(element == null)
        return false;
    element.innerHTML = this.buffer.flush();
    return true;
  // fetching the cloned_buf tags and creating them.
  // rather than clearing the whole screen or overwriting constant elements like texts that haven't been modified,
  // only the modified regions should be overwritten.
};

export const view: View = View as any;
