import { type BaseEditor, Descendant } from 'slate';
import { type ReactEditor } from 'slate-react';
import { type HistoryEditor } from 'slate-history';
import { type BlockStyle, InlineStyle } from '@notespace/shared/src/document/types/styles';
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
  type: BlockStyle | InlineStyle;
  children: Descendant[];
}

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor & HistoryEditor;
    Text: CustomText;
    Element: CustomElement;
  }
}
