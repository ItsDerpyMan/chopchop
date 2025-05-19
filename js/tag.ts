// Type for Tag properties
export type Tag = {
  tag: string;
  class: string;
  str: string;
  x: number;
};

// Tag constructor
function Tag(this: Tag, tag: string = "span", attr: string, str: string, x: number = 0) {
  this.tag = tag;
  this.class = attr;
  this.str = str;
  this.x = x;
}

