import { BaseEditor } from 'slate';
import { ReactEditor } from 'slate-react';
import { ElementType } from '@src/editor/slate/modules/Elements.ts';

export type CustomElement = { type: ElementType; children: CustomText[] };
export type CustomText = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  code?: boolean;
  strikethrough?: boolean;
  deleted?: boolean;
  inserted?: boolean;
};

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}
