import { type BaseEditor, type Descendant } from 'slate';
import { type ReactEditor } from 'slate-react';
import { type HistoryEditor } from 'slate-history';
import { type BlockStyle } from '../../../../../shared/types/styles.ts';

export interface CustomFormat {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  code?: boolean;
}

export interface CustomText extends CustomFormat {
  text: string;
}

export interface CustomElement {
  type: BlockStyle;
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
