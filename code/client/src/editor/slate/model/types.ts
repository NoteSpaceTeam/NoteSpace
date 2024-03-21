import { type BaseEditor, type Descendant } from 'slate';
import { type ReactEditor } from 'slate-react';
import { type HistoryEditor } from 'slate-history';
import { type BlockType } from '@notespace/shared/crdt/styles.ts';

export interface CustomText {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  code?: boolean;
}

export interface CustomElement {
  type: BlockType;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  children: Descendant[];
}

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor & HistoryEditor;
    Element: CustomElement & Element;
    Text: CustomText;
  }
}
