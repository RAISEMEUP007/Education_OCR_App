import type { Cell } from './Cell.js';

export class Row {
  cells: Cell[];

  constructor() {
    this.cells = [];
  }

  toString(): string {
    return this.cells.map((c) => `[${c}]`).join('');
  }

  toArray(): string[] {
    return this.cells.map((c) => c.toString());
  }

  isHeader(): boolean {
    return this.cells.some((c) => c.isHeader);
  }
}
