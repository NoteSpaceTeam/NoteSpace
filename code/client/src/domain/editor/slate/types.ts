import { type BaseEditor, type Descendant } from 'slate';
import { type ReactEditor } from 'slate-react';
import { type HistoryEditor } from 'slate-history';
import { type BlockStyle } from '@notespace/shared/types/styles';
import { CursorData } from '@/domain/editor/slate/hooks/useCursors';

export interface CustomFormat {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  code?: boolean;
}

export interface CustomText extends CustomFormat {
  text: string;
  cursor?: CursorData;
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