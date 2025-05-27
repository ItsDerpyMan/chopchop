import { chunk, Player, World } from "./world.ts";

export abstract class Component {}

export interface System {
  name: string;
  requiredComponents: (new (...args: any[]) => Component)[]; // Component types needed, e.g., ["position", "moving"]
  update: (chunk: chunk | Player | undefined, world: World) => void;
}

export class Position extends Component {
  constructor(public x: number, public y: number) {
    super();
  }
  toKey(): string {
    return `${this.x},${this.y}`;
  }

  override toString(): string {
    return "position";
  }
  getValues(): [number, number] {
    return [this.x, this.y];
  }

  static create(): System {
    return {
      name: "position",
      requiredComponents: [Position, Moving],
      update: (entities, world): boolean => {
        if (entities === undefined) {
          return false;
        }
        for (const [_, entity] of entities.entries()) {
          if (
            entity.components.has("position") && entity.components.has("moving")
          ) {
            const pos = entity.components.values().find((c: Component) =>
              c instanceof Position
            ) as Position;
            const move = entity.components.values().find((c: Component) =>
              c instanceof Moving
            ) as Moving;
            if (move.moving) {
              pos.x += move.dx;
              pos.y += move.dy;
              move.moving = false;
              move.dx = 0;
              move.dy = 0;
            }
          }
        }
        return true;
      },
    };
  }
}
export class Health extends Component {
  constructor(public health: number) {
    super();
  }
  static create(): System {
    return {
      name: "health",
      requiredComponents: [Health],
      update: (entities, world): boolean => {
        return true;
      },
    };
  }
  override toString(): string {
    return "Health";
  }

  getValues(): number {
    return this.health;
  }
}

export class Moving extends Component {
  constructor(public moving: boolean, public dx: number, public dy: number) {
    super();
  }
}

export class Attack extends Component {
  constructor(public attacking: boolean, public delta_time: number) {
    super();
  }
}

export class BoundingBox extends Component {
  constructor(public bounding: boolean) {
    super();
  }
}
