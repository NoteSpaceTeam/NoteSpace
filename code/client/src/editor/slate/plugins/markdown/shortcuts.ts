import { type CustomElement } from '@editor/slate/model/types.ts';
import { BlockStyles, InlineStyles } from '@notespace/shared/crdt/types/styles';
import { type Editor, Element, Range, Text, Transforms } from 'slate';
import { createDescendant } from '@editor/slate/model/utils.ts';

const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const blockRules = (...triggers: string[]) => triggers.map(trigger => new RegExp(`^(${escapeRegExp(trigger)})$`));

const inlineRules = (...triggers: string[]) =>
  triggers.map(trigger => {
    const escaped = escapeRegExp(trigger);
    return new RegExp(`(${escaped}).+?(${escaped})$`);
  });

/**
 * Creates a function that applies a block element to the editor.
 * @param type
 */
function createSetBlockApply(type: Element['type']) {
  return (editor: Editor, range: Range) => {
    Transforms.setNodes(editor, { type }, { match: n => Element.isElement(n) && editor.isBlock(n), at: range });
  };
}

/**
 * Creates a function that applies an inline element to the editor.
 * @param type
 */
function createSetInlineApply(type: Element['type']) {
  return (editor: Editor, range: Range) => {
    const rangeRef = editor.rangeRef(range);

    Transforms.unwrapNodes(editor, {
      at: range,
      match: (n: CustomElement) => editor.isInline(n),
      mode: 'all',
      split: true,
    });

    if (rangeRef.current) {
      Transforms.insertNodes(
        editor,
        { text: '' },
        { match: Text.isText, at: Range.end(rangeRef.current), select: true }
      );
    }

    const targetRange = rangeRef.unref();
    if (targetRange) {
      Transforms.wrapNodes(editor, createDescendant(type, []), {
        at: targetRange,
        split: true,
      });
    }
  };
}

/**
 * Creates a function that applies a mark to the editor.
 * @param key
 */
function createSetMarkApply(key: Exclude<keyof Text, 'text'>) {
  return (editor: Editor, range: Range) => {
    Transforms.insertNodes(editor, { text: ' ' }, { match: Text.isText, at: Range.end(range), select: true });
    Transforms.setNodes(editor, { [key]: true }, { match: Text.isText, at: range, split: true });
  };
}

/**
 * Shortcuts for markdown.
 */
export const shortcuts = [
  { trigger: blockRules('#'), apply: createSetBlockApply(BlockStyles.h1) },
  { trigger: blockRules('##'), apply: createSetBlockApply(BlockStyles.h2) },
  { trigger: blockRules('###'), apply: createSetBlockApply(BlockStyles.h3) },
  { trigger: blockRules('####'), apply: createSetBlockApply(BlockStyles.h4) },
  { trigger: blockRules('#####'), apply: createSetBlockApply(BlockStyles.h5) },
  { trigger: blockRules('######'), apply: createSetBlockApply(BlockStyles.h6) },
  {
    trigger: blockRules('>'),
    apply: createSetBlockApply(BlockStyles.blockquote),
  },
  { trigger: blockRules('-', '*'), apply: createSetBlockApply(BlockStyles.li) },
  { trigger: blockRules('1.'), apply: createSetBlockApply(BlockStyles.num) },
  {
    trigger: blockRules('```', '`'),
    apply: createSetBlockApply(BlockStyles.code),
  },
  { trigger: blockRules('---'), apply: createSetInlineApply(BlockStyles.hr) },
  {
    trigger: inlineRules('**', '__'),
    apply: createSetMarkApply(InlineStyles.bold),
  },
  {
    trigger: inlineRules('*', '_'),
    apply: createSetMarkApply(InlineStyles.italic),
  },
  {
    trigger: inlineRules('~~'),
    apply: createSetMarkApply(InlineStyles.strikethrough),
  },
  {
    trigger: inlineRules('=='),
    apply: createSetMarkApply(InlineStyles.underline),
  },
];