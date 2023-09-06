import type { Field } from './Field.js';

interface FieldsMap {
  [key: string]: Field;
}

export class Form {
  fields: Field[];
  fieldsMap: FieldsMap;

  constructor() {
    this.fields = [];
    this.fieldsMap = {};
  }

  addField(field: Field) {
    this.fields.push(field);
    this.fieldsMap[field.key?.text || ''] = field;
  }

  toString() {
    return this.fields.join('\n');
  }

  getFieldByKey(key: string): Field | undefined {
    return this.fieldsMap[key];
  }

  searchFieldsByKey(key: string) {
    const searchKey = key.toLowerCase();
    return this.fields.filter((f) => f.key?.text.toLowerCase().includes(searchKey));
  }
}
