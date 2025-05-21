import { Buffer } from "./buffer.ts";
import { Viewport} from "./viewport.ts";

// Interface defining the View structure
export interface View {
  width: number;
  height: number;
  buf: Buffer;
  viewport: Viewport;
  render(): boolean;
}

// Class implementing the View interface
export class View implements View {
  width: number;
  height: number;
  buf: Buffer;
  viewport: Viewport;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.buf = new Buffer(this);
    this.viewport = new Viewport(this, "main");
  }

  render(): boolean {
    const element = this.viewport.getInstance();
    if (element == null) {
      return false;
    }
    element.innerHTML = this.buf.flush();
    return true;
    // fetching the cloned_buf tags and creating them.
    // rather than clearing the whole screen or overwriting constant elements like texts that haven't been modified,
    // only the modified regions should be overwritten.
  }
}
