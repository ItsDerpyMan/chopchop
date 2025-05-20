// Interface defining the Tag structure
export interface Tag {
  str: string;
  x: number;
  insert(str: string): string;
  getString(): string;
  getX(): number;
}

// Class implementing the Tag interface
export class Tag implements Tag {
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

//export type TagConstructor = new (x: number, str: string) => Tag;
