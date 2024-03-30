import { BlockStyles, InlineStyle, InlineStyles } from '@notespace/shared/types/styles';
import { type Selection } from '@notespace/shared/types/cursor';
import { type Editor, Element, Range, Text, Transforms } from 'slate';
import { Fugue } from '@editor/crdt/fugue.ts';

const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const blockRules = (...triggers: string[]) => triggers.map(trigger => new RegExp(`^(${escapeRegExp(trigger)})$`));

const inlineRules = (...triggers: string[]) =>
  triggers.map(trigger => {
    const escaped = escapeRegExp(trigger);
    return new RegExp(`(${escaped}).+?(${escaped})$`);
  });

/**
 * Creates a function that applies a block element to the editor
 * @param type
 */
function createSetBlockApply(type: Element['type']) {
  const fugue = Fugue.getInstance();
  return (editor: Editor, range: Range) => {
    const line = range.anchor.path[0];
    fugue.updateBlockStyleLocal(type, line);
    Transforms.setNodes(editor, { type }, { match: n => Element.isElement(n) && editor.isBlock(n), at: range });
  };
}

/**
 * Returns a function that applies an inline style to a block of text in the editor
 * @param key
 */
function createSetInlineApply(key: Exclude<keyof Text, 'text'>) {
  const fugue = Fugue.getInstance();
  return (editor: Editor, range: Range) => {
    const selection: Selection = {
      start: {
        line: range.anchor.path[0],
        column: range.anchor.offset,
      },
      end: {
        line: range.focus.path[0],
        column: range.focus.offset,
      },
    };
    fugue.updateInlineStyleLocal(selection, true, key as InlineStyle);
    Transforms.insertNodes(editor, { text: ' ' }, { match: Text.isText, at: Range.end(range), select: true });
    Transforms.setNodes(editor, { [key]: true }, { match: Text.isText, at: range, split: true });
  };
}

/**
 * Shortcuts for the markdown editor
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
  { trigger: blockRules('---'), apply: createSetBlockApply(BlockStyles.hr) },
  {
    trigger: inlineRules('**', '__'),
    apply: createSetInlineApply(InlineStyles.bold),
  },
  {
    trigger: inlineRules('*', '_'),
    apply: createSetInlineApply(InlineStyles.italic),
  },
  {
    trigger: inlineRules('~~'),
    apply: createSetInlineApply(InlineStyles.strikethrough),
  },
  {
    trigger: inlineRules('=='),
    apply: createSetInlineApply(InlineStyles.underline),
  },
];
