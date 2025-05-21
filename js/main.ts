// Interfaces
interface Tag {
  str: string;
  x: number;
  insert(str: string): string;
  getString(): string;
  getX(): number;
}

interface View {
  width: number;
  height: number;
  buffer: Buffer;
  viewport: Viewport;
  render(): boolean;
}

interface Buffer {
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

interface Viewport {
  view: View;
  location: string;
  hasBeenInitialized(): boolean;
  createInstance(): boolean;
  getInstance(): Element | null;
}

// Classes
class Tag implements Tag {
  str: string;
  x: number;

  constructor(x: number = 0, str: string) {
    this.str = str;
    this.x = x;
  }

  insert(str: string): string {
    return str.slice(0, this.getX()) + this.getString() + str.slice(this.getX());
  }

  getString(): string {
    return this.str;
  }

  getX(): number {
    return this.x;
  }
}

class View implements View {
  width: number;
  height: number;
  buffer: Buffer;
  viewport: Viewport;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.buffer = new Buffer(this);
    this.viewport = new Viewport(this, "main");
  }

  render(): boolean {
    const element = this.viewport.getInstance();
    if (element == null) {
      return false;
    }
    element.innerHTML = this.buffer.flush();
    return true;
  }
}

class Buffer implements Buffer {
  view: View;
  buf: string[];
  tags: Tag[][];

  constructor(view: View) {
    this.view = view;
    this.buf = [];
    this.tags = [];
    this.resize(view.width, view.height);
  }
    private setSize(width: number, height: number): boolean{
        if(width < 0 || height < 0 )
            return false;
        this.view.width = width;
        this.view.height = height;
        return true;
    }

    public resize(newWidth: number, newHeight: number, character: string = " "): boolean{
        // We store the old size
        let oldWidth = this.view.width;
        let oldHeight = this.view.height;

        // We check if the character is correct, return false if it isn't
        if(character.length != 1)
            return false;

        // We try to change the size, return false if failure
        if(this.setSize(newWidth, newHeight) == false)
            return false;

        // We resize the height
        if(newHeight > oldHeight){ // If the new height is higher
            for(let i = oldHeight; i < newHeight; i++){ // We add the lines corresponding to the new height
                // We resize the tags
                this.tags.push([]);

                // We resize the buf
                this.buf.push("");
                // If the new width is higher
                if(newWidth > oldWidth){
                    for(let j = 0; j < oldWidth; j++){ // We fill the new lines from 0 to the old width
                        this.buf[i] += character;
                    }
                }
                // Else, if the old width is higher
                else if(oldWidth > newWidth){
                    for(let j = 0; j < newWidth; j++){ // We fill the new lines from 0 to the new width
                        this.buf[i] += character;
                    }
                }
            }
        }
        else if(oldHeight > newHeight){ // Else, if the old height was higher
            // We resize the tags
            this.tags.splice(this.tags.length - (oldHeight - newHeight), oldHeight - newHeight); // We remove some lines to reduce the height

            // We resize the buf
            this.buf.splice(this.buf.length - (oldHeight - newHeight), oldHeight - newHeight); // We remove some lines to reduce the height
        }

        // We resize the width
        if(newWidth > oldWidth){ // If the new width is higher
            // We add characters at the end of the lines (lines 0 to new height)
            for(let i = 0; i < newHeight; i++){
                for(let j = oldWidth; j < newWidth; j++){
                    this.buf[i] += character;
                }
            }
        }
        else if(oldWidth > newWidth){ // Else, if the old width was higher
            // We each line (0 to new height), we only keep the beginning of the string
            for(let i = 0; i < newHeight; i++){
                this.buf[i] = this.buf[i].substr(0, newWidth);
            }
        }

        // And we return true
        return true;
    }
  addAsciiButton(x1: number, x2: number, y: number, Attr: string = ""): boolean {
    return this.addTwoTags(x1, x2, y, String.raw`<span class="asciiButton ${Attr}">`, String.raw`</span`);
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

class Viewport implements Viewport {
  view: View;
  location: string;

  constructor(view: View, loc: string) {
    this.view = view;
    this.location = loc;
    this.hasBeenInitialized();
  }

  hasBeenInitialized(): boolean {
    const element = document.getElementById(this.location);
    if (element != null) {
      return true;
    }
    return false;
  }

  createInstance(): boolean {
    if (!this.hasBeenInitialized()) {
      document.body.appendChild(document.createElement("pre")).setAttribute("id", this.location);
      return true;
    }
    return false;
  }

  getInstance(): Element | null {
    if (!this.createInstance()) {
      return null;
    }
    return document.getElementById(this.location);
  }
}

// Main execution code
const myView = new View(5, 10);
const arr = String.raw`
    _____________________________
    |:''''''''''''''''''''''''':|
    |:          _____          :|
    |:         /     \         :|
    |_________(_[   ]_)_________|
    |:¨¨¨¨¨¨¨¨¨\_____/¨¨¨¨¨¨¨¨¨:|
    |:                         :|
    |:                         :|
    |:  ___    .-"""-.    ___  :|
    |:  \  \  /\ \ \ \\  /  /  :|
    |:   }  \/\ \ \ \ \\/  {   :|
    |:   }  /\ \ \ \ \ /\  {   :|
    |:  /__/  \ \ \ \ /  \__\  :|
    |:         '-...-'         :|
    |:.........................:|
    |___________________________|
`.split("\n").filter(line => line.trim() !== "");

myView.buffer.resize(5, 5);
myView.buffer.writeArray(arr, 0, 0);
const success = myView.render();
console.log("Render successful:", success);
