// Location constructor
/**
 * @param {string} loc - location
 */
export function Viewport(loc) {
  this.location = loc;
  this.initialized = false;
  this.hasBeenInitialized = function () {
    const element = document.getElementById(this.location);
    if(!this.initialized){
        this.createInstance();
        }
    };
  this.hasBeenInitialized();
}

// Location prototype method
Viewport.prototype.createInstance = function () {
  if (!this.initialized) {
    document.body.appendChild(document.createElement("pre")).setAttribute(
      "id",
      this.location,
    );
    this.initialized = true;
  }
};
Viewport.prototype.getInstance = function () {
  if (!this.initialized) {
    return null;
  }
  return document.getElementById(this.location);
};
