// Location constructor
/**
    *
    * @param {string} loc - location
    */
export function Viewport(loc) {
  this.location = loc;
  this.hasBeenInitialized = function(){
    const element = document.getElementById(this.location);
    if (element != null) {
      return true;
    }
    return false;
  };
  this.hasBeenInitialized();
}

// Location prototype method
Viewport.prototype.createInstance = function(){
  if (!this.hasBeenInitialized()) {
    document.body.appendChild(document.createElement("pre")).setAttribute("id", this.location);
    return true;
  }
  return false;
};
Viewport.prototype.getInstance = function() {
    if(!this.createInstance()) {
        return null;
    }
    return document.getElementById(this.location);
}
