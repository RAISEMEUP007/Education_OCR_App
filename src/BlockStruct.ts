import { literal, number, object, string, tuple, union, infer as zinfer } from 'zod';
import { GeometryStructSchema } from './Geometry/index.js';

const BlockBaseSchema = object({
  Confidence: number().min(0),
  Geometry: GeometryStructSchema,
  Id: string(),
  Page: number().min(0).optional(),
  Text: string().nullable().optional(),
});

const WordBlockSchema = BlockBaseSchema.extend({
  BlockType: literal('WORD'),
});
export type WordBlock = zinfer<typeof WordBlockSchema>;

const SelectionElementBlockSchema = BlockBaseSchema.extend({
  BlockType: literal('SELECTION_ELEMENT'),
  Relationships: object({
    Type: literal('CHILD'),
    Ids: string().array(),
  })
    .array()
    .optional()
    .nullable(),
  SelectionStatus: literal('SELECTED').or(literal('NOT_SELECTED')),
});
export type SelectionElementBlock = zinfer<typeof SelectionElementBlockSchema>;

const KeyValueSetBlockSchema = BlockBaseSchema.extend({
  BlockType: literal('KEY_VALUE_SET'),
  EntityTypes: tuple([literal('KEY').or(literal('VALUE'))]),
  Relationships: object({
    Type: literal('VALUE').or(literal('CHILD')),
    Ids: string().array(),
  }).array(),
});
export type KeyValueSetBlock = zinfer<typeof KeyValueSetBlockSchema>;

const LineBlockSchema = BlockBaseSchema.extend({
  BlockType: literal('LINE'),
  Relationships: object({
    Type: literal('CHILD'),
    Ids: string().array(),
  }).array(),
});
export type LineBlock = zinfer<typeof LineBlockSchema>;

const CellBlockSchema = BlockBaseSchema.extend({
  BlockType: literal('CELL'),
  RowIndex: number().min(0),
  ColumnIndex: number().min(0),
  RowSpan: literal(1),
  ColumnSpan: literal(1),
  Relationships: object({
    Type: literal('CHILD'),
    Ids: string().array(),
  })
    .array()
    .nullable()
    .optional(),
  EntityTypes: tuple([
    union([literal('COLUMN_HEADER'), literal('TABLE_SUMMARY'), literal('TABLE_SECTION_TITLE')]),
  ])
    .nullable()
    .optional(),
});
export type CellBlock = zinfer<typeof CellBlockSchema>;

const MergedCellBlockSchema = BlockBaseSchema.extend({
  BlockType: literal('MERGED_CELL'),
  RowIndex: number().min(0),
  ColumnIndex: number().min(0),
  RowSpan: number().min(1),
  ColumnSpan: number().min(1),
  Relationships: object({
    Type: literal('CHILD'),
    Ids: string().array(),
  })
    .array()
    .optional(),
});
export type MergedCellBlock = zinfer<typeof MergedCellBlockSchema>;

const TableBlockSchema = BlockBaseSchema.extend({
  BlockType: literal('TABLE'),
  Relationships: object({
    Type: union([
      literal('CHILD'),
      literal('MERGED_CELL'),
      literal('TABLE_TITLE'),
      literal('TABLE_FOOTER'),
    ]),
    Ids: string().array(),
  }).array(),
  EntityTypes: tuple([union([literal('STRUCTURED_TABLE'), literal('SEMI_STRUCTURED_TABLE')])])
    .nullable()
    .optional(),
});
export type TableBlock = zinfer<typeof TableBlockSchema>;

const TableTitleBlockSchema = BlockBaseSchema.extend({
  BlockType: literal('TABLE_TITLE'),
  Relationships: object({
    Type: literal('CHILD'),
    Ids: string().array(),
  }).array(),
});
export type TableTitleBlock = zinfer<typeof TableTitleBlockSchema>;

const TableFooterBlockSchema = BlockBaseSchema.extend({
  BlockType: literal('TABLE_FOOTER'),
  Relationships: object({
    Type: literal('CHILD'),
    Ids: string().array(),
  }).array(),
});
export type TableFooterBlock = zinfer<typeof TableFooterBlockSchema>;

const PageBlockSchema = BlockBaseSchema.extend({
  BlockType: literal('PAGE'),
  Relationships: object({
    Type: literal('CHILD'),
    Ids: string().array(),
  }).array(),
}).omit({ Confidence: true });
export type PageBlock = zinfer<typeof PageBlockSchema>;

export const BlockStructSchema = union([
  WordBlockSchema,
  SelectionElementBlockSchema,
  KeyValueSetBlockSchema,
  LineBlockSchema,
  CellBlockSchema,
  MergedCellBlockSchema,
  TableBlockSchema,
  TableTitleBlockSchema,
  TableFooterBlockSchema,
  PageBlockSchema,
]);
export type BlockStruct = zinfer<typeof BlockStructSchema>;

export interface BlockMap {
  [key: string]: BlockStruct;
}
