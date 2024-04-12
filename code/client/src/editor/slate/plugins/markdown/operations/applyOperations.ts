import { type Editor, Element, Range, Text, Transforms } from 'slate';
import { getSelectionByRange } from '@editor/slate/utils/selection';
import { BlockStyle, InlineStyle } from '@notespace/shared/types/styles';
import { BlockHandler, InlineHandler } from '@editor/domain/markdown/types';

/**
 * Creates a function that applies a block element to the editor
 * @param style
 * @param handler
 */
export function createSetBlockApply(style: BlockStyle, handler: BlockHandler) {
  return (editor: Editor, range: Range) => {
    const line = range.anchor.path[0];
    Transforms.setNodes(editor, { type: style }, { match: n => Element.isElement(n) && editor.isBlock(n), at: range });
    handler(style, line);
  };
}

/**
 * Returns a function that applies an inline style to a block of text in the editor
 * @param style
 * @param triggerLength
 * @param handler
 */
export function createSetInlineApply(style: InlineStyle, triggerLength: number, handler: InlineHandler) {
  return (editor: Editor, range: Range) => {
    const key = style;
    Transforms.insertNodes(editor, { text: ' ' }, { match: Text.isText, at: Range.end(range), select: true });
    Transforms.setNodes(editor, { [key]: true }, { match: Text.isText, at: range, split: true });

    const selection = getSelectionByRange(editor, range, triggerLength);
    handler(key, triggerLength, selection);
  };
}
