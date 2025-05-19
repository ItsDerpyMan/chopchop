import { View } from "./view.ts";
import { Tag } from "./tag.ts";
import { Links } from "./links.ts";

export type Buffer = {
    new (view: View): Buffer;
    view: View;
    buf: string[];
    tags: Tag[][];
    links: string[];
    init: () => void;
    resize(newWidth: number, newHeight: number): boolean;
    addTag(this: Buffer, tag: Tag, y: number): boolean;
    write(this: Buffer, str: string, x: number, y: number): boolean;
    writeArray(this: Buffer, arr: string[], x: number, y: number): void;
    flush(this: Buffer): string[];
};

// Buffer constructor
function Buffer(this: Buffer, view: View) {
    this.view = view;
    this.buf = [];
    this.tags = [];
    this.links = [];
    this.init = (width: number = 0, height: number = 0) => {
        this.resize(width, height);
    }
}
Buffer.prototype.resize = function(newWidth: number, newHeight: number): boolean {
    const oldWidth = this.view.width;
    const oldHeight = this.view.height;

    if(newWidth < 0 || newHeight < 0) {
        return false;
    }
    this.view.width = newWidth;
    this.view.height = newHeight;

    if(newHeight > oldHeight) {
        for(let i = oldHeight; i < newHeight; i++) {
            this.tags.push([]);
            this.buf.push("");
            if(newWidth > oldWidth) {
                for(let _ = 0; _ < oldWidth; _++) {
                    this.buf[i] += " ";
                }
            }
            else{
                for(let _ = 0; _ < newWidth; _++){
                    this.buf[i] += " ";
                }
            }
        }
    }
    else{
        this.tags.splice(this.tags.length - (oldHeight - newHeight), oldHeight - newHeight);
        this.buf.splice(this.tags.length - (oldHeight - newHeight), oldHeight - newHeight);
    }

    if(newWidth > oldWidth){
        for(let i = 0; i < newHeight; i++){
            for(let _ = oldWidth; _ < newWidth; _++){
                this.buf[i] += " ";
            }
        }
    }
    else {
        for(let i = 0; i < newHeight; i++){
            this.buf[i] = this.buf[i].substring(0, newWidth);
            }
        }
    return true;
}


// Buffer prototype methods
Buffer.prototype.addTag = function(this: Buffer, tag: Tag, y: number): boolean {
    if (y < 0 || y >= this.view.height) {
      return false;
    }
    if (tag.x < 0 || tag.x > this.view.width) {
      return false;
    }
    if (!this.tags[y] || this.tags[y].length === 0) {
      this.tags[y] = this.tags[y] || [];
      this.tags[y].push(tag);
      return true;
    }
    else {
      for (let i = 0; i < this.tags[y].length; i++) {
        if (tag.x > this.tags[y][i].x) {
          this.tags[y].splice(i, 0, tag);
          return true;
        }
      }
    }
    this.tags[y].push(tag);
    return true;
};

Buffer.prototype.write = function(this: Buffer, str: string, x: number, y: number): boolean {
    let indexFirst: number = 0;
    let indexLast: number = str.length;

    if (y < 0 || y >= this.view.height) {
      return false;
    }

    if (x + indexLast >= this.view.width) {
      indexLast -= x + indexLast - this.view.width;
    }

    if (x < 0) {
      indexFirst = -x;
    }

    if (indexLast < 0 || indexFirst >= str.length) {
      return false;
    }

    this.buf[y] = this.buf[y].slice(0, x) + str + this.buf[y].slice(x + 1);

    return true;
};

Buffer.prototype.writeArray = function(this: Buffer, arr: string[], x: number, y: number): void {
    for (let i = 0; i < arr.length; i++) {
      this.write(arr[i], x, y + i);
    }
};

Buffer.prototype.flush = function(this: Buffer):  string[] {
    let cloned_buf: string[] = [];

    if (this.tags.length === 0) {
      return this.buf
    }
    else {
      cloned_buf = this.buf.slice(0);

      for (let y = 0; y < this.view.height; y++) {
        if (this.tags[y]) {
          for (let x = 0; x < this.tags[y].length; x++) {
            cloned_buf[y] = (cloned_buf[y] || "").slice(0, this.tags[y][x].x) +
              this.tags[y][x].str + (cloned_buf[y] || "").slice(this.tags[y][x].x);
          }
        }
      }
      return cloned_buf;
    }
};


