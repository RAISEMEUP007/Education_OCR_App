import { Geometry } from './Geometry/index.js';

import type { SelectionElementBlock } from './BlockStruct.js';

export class SelectionElement {
  confidence: number;
  geometry: Geometry;
  id: string;
  selectionStatus: string;

  constructor(block: SelectionElementBlock) {
    this.confidence = block.Confidence;
    this.geometry = new Geometry(block.Geometry);
    this.id = block.Id;
    this.selectionStatus = block.SelectionStatus;
  }
}
