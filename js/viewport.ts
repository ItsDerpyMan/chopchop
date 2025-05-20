import { View } from "./view.ts";

// Type for Location properties
export type Viewport = {
    new (view: View, loc: string): Viewport;
    view: View;
    location: string;
    hasBeenInitialized: () => boolean;
    createInstance(this: Viewport): boolean;
    getInstance(this: Viewport): Element | null;
};

// Location constructor
function Viewport(this: Viewport, view: View, loc: string) {
  this.view = view;
  this.location = loc;
  this.hasBeenInitialized = function(): boolean {
    const element = document.getElementById(this.location);
    if (element != null) {
      return false;
    }
    return true;
  };
  this.hasBeenInitialized();
}

// Location prototype method
Viewport.prototype.createInstance = function(this: Viewport): boolean {
  if (!this.hasBeenInitialized()) {
    document.body.appendChild(document.createElement("pre")).setAttribute("id", this.location);
    return true;
  }
  return false;
};
Viewport.prototype.getInstance = function(this: Viewport): Element | null {
    if(!this.createInstance()) {
        return null;
    }
    return document.getElementById(this.location);
}
export const viewport: Viewport = Viewport as any;
