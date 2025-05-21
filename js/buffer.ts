import { View } from "./view.ts";
import { Tag } from "./tag.ts";

// Interface defining the Buffer structure
export interface Buffer {
  view: View;
  buf: string[];
  tags: Tag[][];
  init(width?: number, height?: number): void;
  resize(newWidth: number, newHeight: number): boolean;
  addAsciiButton(x1: number, x2: number, y: number, Attr?: string): boolean;
  addBold(x1: number, x2: number, y: number): boolean;
  addTwoTags(x1: number, x2: number, y: number, tag1: string, tag2: string): boolean;
  addTag(tag: Tag, y: number): boolean;
  write(str: string, x: number, y: number): boolean;
  writeArray(arr: string[], x: number, y: number): void;
  flush(): string;
}

// Class implementing the Buffer interface
export class Buffer implements Buffer {
  view: View;
  buf: string[];
  tags: Tag[][];

  constructor(view: View) {
    this.view = view;
    this.buf = [];
    this.tags = [];
    this.init(view.width, view.height);
  }

  init(width: number = 0, height: number = 0): void {
    this.resize(width, height);
  }

  resize(newWidth: number, newHeight: number): boolean {
    const oldWidth = this.view.width;
    const oldHeight = this.view.height;

    if (newWidth < 0 || newHeight < 0) {
      return false;
    }
    this.view.width = newWidth;
    this.view.height = newHeight;

    if (newHeight > oldHeight) {
      for (let i = oldHeight; i < newHeight; i++) {
        this.tags.push([]);
        this.buf.push("");
        if (newWidth > oldWidth) {
          for (let _ = 0; _ < oldWidth; _++) {
            this.buf[i] += " ";
          }
        } else {
          for (let _ = 0; _ < newWidth; _++) {
            this.buf[i] += " ";
          }
        }
      }
    } else {
      this.tags.splice(this.tags.length - (oldHeight - newHeight), oldHeight - newHeight);
      this.buf.splice(this.tags.length - (oldHeight - newHeight), oldHeight - newHeight);
    }

    if (newWidth > oldWidth) {
      for (let i = 0; i < newHeight; i++) {
        for (let _ = oldWidth; _ < newWidth; _++) {
          this.buf[i] += " ";
        }
      }
    } else {
      for (let i = 0; i < newHeight; i++) {
        this.buf[i] = this.buf[i].substring(0, newWidth);
      }
    }
    return true;
  }

  addAsciiButton(x1: number, x2: number, y: number, Attr: string = ""): boolean {
    return this.addTwoTags(x1, x2, y, `span class="asciiButton ${Attr}"`, "</span");
  }

  addBold(x1: number, x2: number, y: number): boolean {
    return this.addTwoTags(x1, x2, y, "<b>", "</b>");
  }

  addTwoTags(x1: number, x2: number, y: number, tag1: string, tag2: string): boolean {
    if (this.addTag(new Tag(x1, tag1), y) === false || this.addTag(new Tag(x2, tag2), y) === false) {
      return false;
    }
    return true;
  }

  addTag(tag: Tag, y: number): boolean {
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
    } else {
      for (let i = 0; i < this.tags[y].length; i++) {
        if (tag.x > this.tags[y][i].x) {
          this.tags[y].splice(i, 0, tag);
          return true;
        }
      }
    }
    this.tags[y].push(tag);
    return true;
  }

  write(str: string, x: number, y: number): boolean {
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
  }

  writeArray(arr: string[], x: number, y: number): void {
    for (let i = 0; i < arr.length; i++) {
      this.write(arr[i], x, y + i);
    }
  }

  flush(): string {
    let cloned_buf: string[] = [];

    if (this.tags.length === 0) {
      return this.buf.join("\n");
    } else {
      cloned_buf = this.buf.slice(0);

      for (let y = 0; y < this.view.height; y++) {
        for (let x = 0; x < this.tags[y].length; x++) {
          cloned_buf[y] = this.tags[y][x].insert(cloned_buf[y]);
        }
      }
      return cloned_buf.join("\n");
    }
  }
}
