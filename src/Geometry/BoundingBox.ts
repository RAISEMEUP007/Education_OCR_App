import { number, object, infer as zinfer } from 'zod';

export const BoundingBoxStructSchema = object({
  Width: number().min(0),
  Height: number().min(0),
  Left: number().min(0),
  Top: number().min(0),
});

export type BoundingBoxStruct = zinfer<typeof BoundingBoxStructSchema>;

export class BoundingBox {
  width: number;
  height: number;
  left: number;
  top: number;

  constructor(width: number, height: number, left: number, top: number) {
    this.width = width;
    this.height = height;
    this.left = left;
    this.top = top;
  }

  toString() {
    return `width: ${this.width}, height: ${this.height}, left: ${this.left}, top: ${this.top}`;
  }
}
