import { object, infer as zinfer } from 'zod';
import { BoundingBox, BoundingBoxStructSchema } from './BoundingBox.js';
import { Polygon, PolygonStructSchema } from './Polygon.js';

export const GeometryStructSchema = object({
  BoundingBox: BoundingBoxStructSchema,
  Polygon: PolygonStructSchema.array(),
});

export type GeometryStruct = zinfer<typeof GeometryStructSchema>;

export class Geometry {
  boundingBox: BoundingBox;
  polygon: Polygon[];

  constructor(geometry: GeometryStruct) {
    const { Width, Height, Left, Top } = geometry.BoundingBox;
    this.boundingBox = new BoundingBox(Width, Height, Left, Top);
    this.polygon = geometry.Polygon.map(({ X, Y }) => new Polygon(X, Y));
  }

  toString() {
    return `BoundingBox: ${this.boundingBox}`;
  }
}
