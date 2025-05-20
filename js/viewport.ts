import { View } from "./view.ts";

// Interface defining the Viewport structure
export interface Viewport {
  view: View;
  location: string;
  hasBeenInitialized(): boolean;
  createInstance(): boolean;
  getInstance(): Element | null;
}

// Class implementing the Viewport interface
export class Viewport implements Viewport {
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
      return false;
    }
    return true;
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
