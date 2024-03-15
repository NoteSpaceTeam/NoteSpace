import { BaseEditor } from 'slate';
import { ReactEditor } from 'slate-react';

type CustomElement = { type: 'paragraph' | 'code' | null; children: CustomText[] };
type CustomText = { text: string; bold?: boolean };

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}
