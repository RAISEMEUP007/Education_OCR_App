import { number, object, infer as zinfer } from 'zod';

export const PolygonStructSchema = object({
  X: number().min(0),
  Y: number().min(0),
});

export type PolygonStruct = zinfer<typeof PolygonStructSchema>;

export class Polygon {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  toString() {
    return `x: ${this.x}, y: ${this.y}`;
  }
}
