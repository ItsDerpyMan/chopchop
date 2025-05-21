import { View } from "./view.js";
import { Buffer } from "./buffer.js";
import { Viewport } from "./viewport.js";

// Tree ASCII art for different states
const TREE_ASSETS = {
  oak: {
    full: String.raw`
          _________
         /  ***  \
         |  ***  |
         \_ *** _/
           \_ _/
             | |
             | |
             | |
    `.split("\n").filter(line => line.trim() !== ""),
    noLeaves: String.raw`
          _________
         /         \
         |         |
         \_     _/
           \_ _/
             | |
             | |
             | |
    `.split("\n").filter(line => line.trim() !== ""),
    stub: String.raw`
             _ _
            /   \
           /     \
           |     |
           |     |
           |     |
    `.split("\n").filter(line => line.trim() !== ""),
    sprout: String.raw`
             _ _
            /   \
           /     \
           |  *  |
           |     |
    `.split("\n").filter(line => line.trim() !== "")
  }
};

// Resource class
function Resource() {
  this.name = undefined;
  this.quantity = 0;
}

Resource.prototype.setName = function(name) {
  this.name = name;
  return this;
};

Resource.prototype.setQuantity = function(num) {
  this.quantity = num;
  return this;
};

Resource.prototype.addQuantity = function(num) {
  this.quantity += num;
  return this;
};

// Game class
export function Game() {
    this.statusbar = new Viewport("statusbar");
    this.main = new Viewport("main");

    this.oak_wood = new Resource().setName("oak_wood");
    this.magic_wood = new Resource().setName("magic_wood");
    this.darkmagic_wood = new Resource().setName("darkmagic_wood");

    this.axes = {};
    this.selected_axe = {};

    this.view =

  this.init = () => {
    this.tree = {
      state: 0, // 0: full, 1: noLeaves, 2: stub, 3: sprout
      type: "oak",
      lastInteraction: 0,
      interactionDelay: 1000 // 1 second delay in ms
    };
    this.view = this.treeView(this.main);
    this.setupEventListeners();
  };

  this.init();
}
function Tree(viewport){
    this.view = new View(viewport, 100, 100);

    this.state = 0;
    this.type = "normal";
    this.load();
}
Tree.prototype.load = function(){
    this.view.resetBuffer();

    this.view.resizeFromArray(//todo);
    this.view.writeArray(//todo);



};

Tree.prototype.loadTree = function(x, y){
    this.view.addMultipleButtons("normal_tree",
    x, x+10, y,
    x, x+10, y+1,
    x, x+10, y+2,
    x, x+10, y+3,
    x, x+10, y+4,
    x, x+10, y+5,
    )
};

Game.prototype.pushResource = function(resource) {
  this.resources[resource.name] = resource;
};

Game.prototype.setupEventListeners = function() {
  // Assuming Viewport has a DOM element reference
  this.main.getInstance().addEventListener('click', () => {
    const now = Date.now();
    if (now - this.tree.lastInteraction < this.tree.interactionDelay) {
      return; // Ignore click if within delay period
    ,}

    this.tree.lastInteraction = now;
    this.handleTreeClick();
  });
};

Game.prototype.handleTreeClick = function() {
  // Initialize resource if not exists
  if (!this.resources.oak_wood) {
    this.pushResource(new Resource().setName("oak_wood"));
  }

  // Progress tree state and award resources
  switch (this.tree.state) {
    case 0: // full -> noLeaves
      this.tree.state = 1;
      this.resources.oak_wood.addQuantity(5);
      break;
    case 1: // noLeaves -> stub
      this.tree.state = 2;
      this.resources.oak_wood.addQuantity(3);
      break;
    case 2: // stub -> sprout
      this.tree.state = 3;
      this.resources.oak_wood.addQuantity(1);
      break;
    case 3: // sprout -> full
      this.tree.state = 0;
      break;
  }

  // Update the view
  this.updateTreeView(this.view);
};
