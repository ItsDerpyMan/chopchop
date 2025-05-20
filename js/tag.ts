// Type for Tag properties
export type Tag = {
  new(str: string, x: number): Tag;
  str: string;
  x: number;
  insert(this: Tag, str: string): string;
  getString(this: Tag): string;
  getX(this: Tag): number;
};

// Tag constructor
function Tag(this: Tag, x: number = 0, str: string) {
  this.str = str;
  this.x = x;
}

Tag.prototype.insert = function(this: Tag, str: string){
    return str.slice(0, this.getX()) + this.getString() + str.slice(this.getX());
}
Tag.prototype.getString = function(this: Tag): string{
    return this.str;
}
Tag.prototype.getX = function(this: Tag): number{
    return this.x;
}
export const tag: Tag = Tag as any
