import { Geometry } from '../Geometry/index.js';
import { SelectionElement } from '../SelectionElement.js';
import { Word } from '../Word.js';

import type { BlockMap, BlockStruct, KeyValueSetBlock } from '../BlockStruct.js';

export class FieldKey {
  block: BlockStruct;
  confidence: number;
  geometry: Geometry;
  id: string;
  text: string;
  content: Word[];

  constructor(block: KeyValueSetBlock, children: string[], blockMap: BlockMap) {
    this.block = block;
    this.confidence = block.Confidence;
    this.geometry = new Geometry(block.Geometry);
    this.id = block.Id;
    this.content = [];
    const t: string[] = [];
    for (const id of children) {
      const b = blockMap[id];
      if (b?.BlockType === 'WORD') {
        const w = new Word(b);
        this.content.push(w);
        t.push(w.text);
      }
    }
    this.text = t.join(' ');
  }

  toString() {
    return this.text;
  }
}

export class FieldValue {
  block: BlockStruct;
  confidence: number;
  geometry: Geometry;
  id: string;
  text: string;
  content: (Word | SelectionElement)[];

  constructor(block: KeyValueSetBlock, children: string[], blockMap: BlockMap) {
    this.block = block;
    this.confidence = block.Confidence;
    this.geometry = new Geometry(block.Geometry);
    this.id = block.Id;
    this.text = '';
    this.content = [];

    const t: string[] = [];
    for (const id of children) {
      const b = blockMap[id];
      if (b?.BlockType === 'WORD') {
        const w = new Word(b);
        this.content.push(w);
        t.push(w.text);
      } else if (b?.BlockType === 'SELECTION_ELEMENT') {
        const se = new SelectionElement(b);
        this.content.push(se);
        this.text = se.selectionStatus;
      }
    }

    if (t.length > 0) {
      this.text = t.join(' ');
    }
  }

  toString() {
    return this.text;
  }
}

export class Field {
  key?: FieldKey;
  value?: FieldValue;

  constructor(block: KeyValueSetBlock, blockMap: BlockMap) {
    for (const rs of block.Relationships) {
      if (rs.Type === 'CHILD') {
        this.key = new FieldKey(block, rs.Ids, blockMap);
      } else if (rs.Type === 'VALUE') {
        for (const id of rs.Ids) {
          const b = blockMap[id] as KeyValueSetBlock;
          if (b.EntityTypes.includes('VALUE')) {
            for (const rs2 of b.Relationships) {
              if (rs2.Type === 'CHILD') {
                this.value = new FieldValue(b, rs2.Ids, blockMap);
              }
            }
          }
        }
      }
    }
  }

  toString() {
    const kv = `Key: ${this.key}\nValue: ${this.value}`;
    return `\nField\n==========\n${kv}`;
  }
}
