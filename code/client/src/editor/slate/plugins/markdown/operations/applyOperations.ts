import { type Editor, Element, Range, Text, Transforms } from 'slate';
import { getSelectionByRange } from '@editor/slate/utils/selection';
import { BlockStyle, InlineStyle } from '@notespace/shared/types/styles';
import { BlockCallback, InlineCallback } from '@editor/slate/plugins/markdown/connector/types';

/**
 * Creates a function that applies a block element to the editor
 * @param type
 * @param callback
 */
export function createSetBlockApply(type: BlockStyle, callback: BlockCallback) {
  return (editor: Editor, range: Range) => {
    const line = range.anchor.path[0];
    Transforms.setNodes(editor, { type }, { match: n => Element.isElement(n) && editor.isBlock(n), at: range });
    callback(type, line);
  };
}

/**
 * Returns a function that applies an inline style to a block of text in the editor
 * @param key
 * @param triggerLength
 * @param callback
 */
export function createSetInlineApply(key: InlineStyle, triggerLength: number, callback: InlineCallback) {
  return (editor: Editor, range: Range) => {
    // remove trigger characters
    const selection = getSelectionByRange(editor, range, triggerLength);

    // apply styles in the editor
    Transforms.insertNodes(editor, { text: ' ' }, { match: Text.isText, at: Range.end(range), select: true });
    Transforms.setNodes(editor, { [key]: true }, { match: Text.isText, at: range, split: true });
    callback(key, triggerLength, selection);
  };
}
