import { entityData, System } from "./world.ts";

export abstract class Component {}

export class Position extends Component {
  constructor(public x: number, public y: number) {
    super();
  }
  toKey(): string {
    return `${this.x},${this.y}`;
  }

  hashCode(): number {
    let hash = 17; // Prime number as initial seed
    hash = hash * 31 + this.x; // Multiply by prime 31 and add x
    hash = hash * 31 + this.y; // Multiply by prime 31 and add y
    return hash;
  }

  equals(other: Position): boolean {
    if (!(other instanceof Position)) {
      return false;
    }
    return this.x === other.x && this.y === other.y;
  }

  override toString(): string {
    return `${this.x}, ${this.y}`;
  }
  static createSystem(): System {
    return {
      requiredComponents: [Position, Moving],
      update: (entities, world): boolean => {
        if (entities === undefined) {
          return false;
        }
        for (const [_, entity] of entities.entries()) {
          if (
            entity.components.has(Position) && entity.components.has(Moving)
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
