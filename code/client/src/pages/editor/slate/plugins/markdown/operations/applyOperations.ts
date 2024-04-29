import { type Editor, Element, Range, Text, Transforms } from 'slate';
import { getSelectionByRange } from '@pages/editor/slate/utils/selection.ts';
import { BlockStyle, InlineStyle } from '@notespace/shared/types/styles.ts';
import { ApplyBlockStyle, ApplyInlineStyle } from '@pages/editor/domain/document/markdown/types.ts';

/**
 * Creates a function that applies a block element to the editor
 * @param style
 * @param handler
 */
export function createSetBlockApply(style: BlockStyle, handler: ApplyBlockStyle) {
  return (editor: Editor, range: Range) => {
    const line = range.anchor.path[0];
    Transforms.setNodes(editor, { type: style }, { match: n => Element.isElement(n) && editor.isBlock(n), at: range });
    handler(style, line, true);
  };
}

/**
 * Returns a function that applies an inline style to a block of text in the editor
 * @param style
 * @param triggerLength
 * @param handler
 */
export function createSetInlineApply(style: InlineStyle, triggerLength: number, handler: ApplyInlineStyle) {
  return (editor: Editor, range: Range) => {
    Transforms.insertNodes(editor, { text: ' ' }, { match: Text.isText, at: Range.end(range), select: true });
    Transforms.setNodes(editor, { [style]: true }, { match: Text.isText, at: range, split: true });
    const selection = getSelectionByRange(editor, range, triggerLength);
    handler(style, selection, true, triggerLength);
  };
}
