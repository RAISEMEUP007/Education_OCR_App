import { Geometry } from './Geometry/index.js';
import { Word } from './Word.js';

import type { BlockMap, LineBlock } from './BlockStruct.js';

export class Line {
  block: LineBlock;
  confidence: number;
  geometry: Geometry;
  id: string;
  text: string;
  words: Word[];

  constructor(block: LineBlock, blockMap: BlockMap) {
    this.block = block;
    this.confidence = block.Confidence;
    this.geometry = new Geometry(block.Geometry);
    this.id = block.Id;
    this.text = block.Text ?? '';
    this.words = [];
    for (const rs of block.Relationships.filter((rs) => rs.Type === 'CHILD')) {
      for (const id of rs.Ids) {
        const b = blockMap[id];
        if (b?.BlockType === 'WORD') {
          this.words.push(new Word(b));
        }
      }
    }
  }

  toString() {
    return `Line\n==========\n${this.text}\nWords\n----------\n${this.words
      .map((w) => `[${w}]`)
      .join('')}`;
  }
}
