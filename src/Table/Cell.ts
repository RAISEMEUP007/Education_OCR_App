import { Geometry } from '../Geometry/index.js';
import { SelectionElement } from '../SelectionElement.js';
import { Word } from '../Word.js';

import type { BlockMap, CellBlock } from '../BlockStruct.js';

export class Cell {
  block: CellBlock;
  confidence: number;
  rowIndex: number;
  rowSpan: number;
  columnIndex: number;
  columnSpan: number;
  geometry: Geometry;
  id: string;
  content: (Word | SelectionElement)[];
  text: string;
  isHeader: boolean;
  page: number;

  constructor(block: CellBlock, blockMap?: BlockMap) {
    this.block = block;
    this.confidence = block.Confidence;
    this.rowIndex = block.RowIndex;
    this.columnIndex = block.ColumnIndex;
    this.rowSpan = block.RowSpan;
    this.columnSpan = block.ColumnSpan;
    this.geometry = new Geometry(block.Geometry);
    this.id = block.Id;
    this.content = [];
    this.page = block.Page ?? -1;
    this.isHeader = block.EntityTypes?.includes('COLUMN_HEADER') ?? false;

    const t: string[] = [];
    if (block.Relationships && blockMap) {
      for (const rs of block.Relationships) {
        if (rs.Type === 'CHILD') {
          for (const id of rs.Ids) {
            const b = blockMap[id];
            if (b?.BlockType === 'WORD') {
              const w = new Word(b);
              this.content.push(w);
              t.push(w.text);
            } else if (b?.BlockType === 'SELECTION_ELEMENT') {
              const se = new SelectionElement(b);
              this.content.push(se);
              t.push(se.selectionStatus);
            }
          }
        }
      }
    }
    this.text = t.join(' ');
  }

  toString() {
    return this.text.trim();
  }

  static fromCell(cell: Cell): Cell {
    return Object.create(cell) as Cell;
  }
}
