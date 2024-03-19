import {Elements, InlineElements, CustomElement} from "@src/editor/slate/modules/types.ts";
import {Editor, Element, Range, Text, Transforms} from "slate";

export const shortcuts = [
  { trigger: blockRegex('#'), apply: createSetBlockApply(Elements.h1) },
  { trigger: blockRegex('##'), apply: createSetBlockApply(Elements.h2) },
  { trigger: blockRegex('###'), apply: createSetBlockApply(Elements.h3) },
  { trigger: blockRegex('####'), apply: createSetBlockApply(Elements.h4) },
  { trigger: blockRegex('#####'), apply: createSetBlockApply(Elements.h5) },
  { trigger: blockRegex('######'), apply: createSetBlockApply(Elements.h6) },
  { trigger: blockRegex('>'), apply: createSetBlockApply(Elements.blockquote) },
  { trigger: blockRegex('-'), apply: createSetBlockApply(Elements.li) },
  { trigger: blockRegex('1.'), apply: createSetBlockApply(Elements.num) },
  { trigger: blockRegex('```'), apply: createSetBlockApply(Elements.code) },
  { trigger: blockRegex('---'), apply: createSetInlineApply(Elements.hr) },
  { trigger: inlineRegex('`'), apply: createSetInlineApply(Elements.code) },
  { trigger: inlineRegex('**'), apply: createSetMarkApply(InlineElements.bold) },
  { trigger: inlineRegex('__'), apply: createSetMarkApply(InlineElements.bold)},
  { trigger: inlineRegex('*'), apply: createSetMarkApply(InlineElements.italic) },
  { trigger: inlineRegex('_'), apply: createSetMarkApply(InlineElements.italic) },
  { trigger: inlineRegex('~~'), apply: createSetMarkApply(InlineElements.strikethrough) },
  { trigger: inlineRegex('=='), apply: createSetMarkApply(InlineElements.underline) },
];


function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function inlineRegex(trigger: string) {
  const escaped = escapeRegExp(trigger);
  return new RegExp(`(${escaped}).+?(${escaped})$`);
}

function blockRegex(trigger: string): RegExp {
  const escaped = escapeRegExp(trigger);
  return new RegExp(`^(${escaped})$`);
}

function createSetBlockApply(type: Element['type']) {
  return (editor: Editor, range: Range) => {
    Transforms.setNodes(editor, { type }, { match: n => Element.isElement(n) && Editor.isBlock(editor, n), at: range });
  };
}

function createSetInlineApply(type: Element['type']) {
  return (editor: Editor, range: Range) => {
    const rangeRef = Editor.rangeRef(editor, range);

    Transforms.unwrapNodes(editor, {
      at: range,
      match: (n) => Editor.isInline(editor, n as CustomElement),
      mode: 'all',
      split: true,
    });

    if (rangeRef.current) {
      Transforms.insertNodes(
        editor,
        { text: ' ' },
        {
          match: Text.isText,
          at: Range.end(rangeRef.current),
          select: true,
        }
      );
    }

    const targetRange = rangeRef.unref();
    if (targetRange) {
      Transforms.wrapNodes(
        editor,
        { type, children: [] },
        {
          at: targetRange,
          split: true,
        }
      );
    }
  };
}

function createSetMarkApply(key: Exclude<keyof Text, 'text'>) {
  return (editor: Editor, range: Range) => {
    Transforms.insertNodes(
      editor,
      { text: ' ' },
      {
        match: Text.isText,
        at: Range.end(range),
        select: true,
      }
    );
    Transforms.setNodes(
      editor,
      { [key]: true },
      {
        match: Text.isText,
        at: range,
        split: true,
      }
    );
  };
}