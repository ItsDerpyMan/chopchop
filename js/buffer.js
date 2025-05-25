import { Tag } from "./tag.js";

// Buffer constructor
/**
 * @param {number} width - The lines Width.
 * @param {number} height - The height of the buffer.
 * @type {Object} Buffer - Stores, adds and remove data as needed from the buffer.
 * @property {string[]} buf - The buffer, where text data stored in rows.
 * @property {Tag[][]} tags - The tags buffer is two dimensional buffer where being stored the html elements. These elements will be embedded in the buffer and processed by the html.
 * @property {links[][]} links - Not implemented yet.
 */
export function Buffer(width, height) {
  this.width = 0;
  this.height = 0;
  this.buf = [];
  this.tags = [];
  //this.links = [];
  /** Initializes the buffer and the tags on the given range.*/
  this.init = (width, height) => {
    this.resize(width, height);
  };
  this.init(width, height);
}
/**
 * Resizes the buffers and initialzes them aswell
 * @param {number} newWidth
 * @param {number} newHeight
 * @returns {boolean} - Returns a boolean indicating whether the operation successed.
 */
Buffer.prototype.resize = function (newWidth, newHeight) {
  const oldWidth = this.width;
  const oldHeight = this.height;

  if (newWidth < 0 || newHeight < 0) {
    return false;
  }
  this.width = newWidth;
  this.height = newHeight;

  if (newHeight > oldHeight) {
    for (let i = oldHeight; i < newHeight; i++) {
      this.tags.push([]);
      this.buf.push("");
      if (newWidth > oldWidth) {
        for (let _ = 0; _ < newWidth; _++) {
          this.buf[i] += " ";
        }
      } else {
        this.buf[i] = this.buf[i].slice(0, -(oldWidth - newWidth));
      }
    }
  } else {
    this.tags.splice(
      this.tags.length - (oldHeight - newHeight),
      oldHeight - newHeight,
    );
    this.buf.splice(
      this.tags.length - (oldHeight - newHeight),
      oldHeight - newHeight,
    );
  }
  return true;
};

// Buffer prototype methods
/**
 * Adds a button to the html.
 * @param {number} x1 - From 0.. to the end of the line, where to insert the start of the tag.
 * @param {number} x2 - From 0.. to the end of the line, where to insert the end of the tag.
 * @param {number} y - What line to insert the tag.
 * @param {string} attr - Attach any classes to the tag.
 * @returns {boolean} - Returns a boolean indicating whether the operation successed.
 */
Buffer.prototype.addAsciiButton = function (x1, x2, y, attr = "") {
  return this.addTwoTags(
    x1,
    x2,
    y,
    '<span class="asciiButton ' + attr + '">',
    "</span>",
  );
};
/**
 * Inserts bold tags to the html.
 * @param {number} x1 - From 0.. to the end of the line, where to insert the start of the tag.
 * @param {number} x2 - From 0.. to the end of the line, where to insert the end of the tag.
 * @param {number} y - What line to insert the tag.
 * @returns {boolean} - Returns a boolean indicating whether the operation successed.
 */
Buffer.prototype.addBold = function (x1, x2, y) {
  return this.addTwoTags(x1, x2, y, "<b>", "</b>");
};
/**
 * Adds to tags on different x - positions.
 * @param {number} x1 - From 0.. to the end of the line, where to insert the start of the tag.
 * @param {number} x2 - From 0.. to the end of the line, where to insert the end of the tag.
 * @param {number} y - What line to insert the tag.
 * @param {string} tag1 - First tag.
 * @param {string} tag2  second tag.
 * @returns {boolean} - Returns a boolean indicating whether the operation successed.
 */
Buffer.prototype.addTwoTags = function (x1, x2, y, tag1, tag2) {
  if (
    this.addTag(new Tag(x1, tag1), y) == false ||
    this.addTag(new Tag(x2, tag2), y) == false
  ) {
    return false;
  }
  return true;
};
/**
 * Checks if the tag can be inserted to the tags buffer.
 * @param {tag} tag - A constructed tag, that holds meta data.
 * @param {number} y - What line to insert the tag.
 * @returns {boolean} - Returns a boolean indicating whether the operation successed.
 */
Buffer.prototype.addTag = function (tag, y) {
  if (y < 0 || y >= this.height) {
    return false;
  }
  if (tag.x < 0 || tag.x > this.width) {
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
};
/**
 * Writes on the buffer.
 * @param {string} str - String what will be written on the buffer.
 * @param {number} x - Where its being written.
 * @param {number} y - What line its being written
 * @returns {boolean} - Returns a boolean indicating whether the operation successed.
 */

String.prototype.replaceAt = function (index, text) {
  return this.substring(0, index) + text + this.substring(index + text.length);
};

Buffer.prototype.write = function (str, x, y) {
  let indexFirst = 0;
  let indexLast = str.length;

  if (y < 0 || y >= this.height) {
    return false;
  }

  if (x + indexLast >= this.width) {
    indexLast -= x + indexLast - this.width;
  }

  if (x < 0) {
    indexFirst = -x;
  }

  if (indexLast < 0 || indexFirst >= str.length) {
    return false;
  }

  this.buf[y] = this.buf[y].replaceAt(
    x + indexFirst,
    str.substring(indexFirst, indexLast),
  );

  return true;
};
/**
 * Writes multiply lines of string to the buffer.
 * @param {string[]} arr - The lines.
 * @param {number} x - Where its being written.
 * @param {number} y - What line its being written
 */
Buffer.prototype.writeArray = function (arr, x, y) {
  for (let i = 0; i < arr.length; i++) {
    this.write(arr[i], x, y + i);
  }
};
/**
 * Flushes the buffers to the screen.
 * @returns {string} - Returns the output as a string, init the tags are have embedded into the buffer.
 */
Buffer.prototype.flush = function () {
  let cloned_buf = [];

  if (this.tags.length == 0) {
    return this.buf.join("\n");
  } else {
    cloned_buf = this.buf.slice(0);

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.tags[y].length; x++) {
        cloned_buf[y] = this.tags[y][x].insert(cloned_buf[y]);
      }
    }
    return cloned_buf.join("\n");
  }
};
