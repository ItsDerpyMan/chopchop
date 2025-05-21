// Tag constructor
/**
    * Tags
    * @param {number} x
    * @param {string} str
    */
export function Tag(x = 0, str) {
  this.str = str;
  this.x = x;
}

Tag.prototype.insert = function(str){
    return str.slice(0, this.getX()) + this.getString() + str.slice(this.getX());
}
Tag.prototype.getString = function(){
    return this.str;
}
Tag.prototype.getX = function(){
    return this.x;
}
