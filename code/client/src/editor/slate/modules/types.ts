import {BaseEditor, Descendant} from 'slate';
import {ReactEditor} from 'slate-react';
import {HistoryEditor} from "slate-history";

export type CustomText = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  code?: boolean;
};

export type CustomElement = {
  type: ElementType;
  children: Descendant[];
}

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor & HistoryEditor;
    Element: CustomElement & Element;
    Text: CustomText;
  }
}

export const Elements = {
  p: 'paragraph',
  h1: 'heading-one',
  h2: 'heading-two',
  h3: 'heading-three',
  h4: 'heading-four',
  h5: 'heading-five',
  h6: 'heading-six',
  blockquote: 'block-quote',
  li: 'list-item',
  num: 'numbered-list-item',
  code: 'code',
  hr: 'horizontal-rule',
} as const;

export const InlineElements = {
  bold: 'bold',
  italic: 'italic',
  underline: 'underline',
  strikethrough: 'strikethrough',
  code: 'inline-code',
  a: 'link',
} as const;

export type ElementType = (typeof Elements)[keyof typeof Elements];
