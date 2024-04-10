import { type Editor, Element, Range, Text, Transforms } from 'slate';
import { Fugue } from '@editor/crdt/Fugue';
import { getSelectionByRange } from '@editor/slate/utils/selection';
import { BlockStyle, InlineStyle } from '@notespace/shared/types/styles';
import { Selection } from '@notespace/shared/types/cursor';
import { FugueNode } from '@editor/crdt/types';
import { Id } from '@notespace/shared/crdt/types/nodes';
import { range } from 'lodash';
import { DeleteOperation } from '@notespace/shared/crdt/types/operations';

/**
 * Creates a function that applies a block element to the editor
 * @param type
 * @param fugue
 */
export function createSetBlockApply(type: BlockStyle, fugue: Fugue) {
  return (editor: Editor, range: Range) => {
    const line = range.anchor.path[0];
    const cursor = { line, column: 0 };
    const triggerNodes = fugue.traverseBySeparator(' ', cursor, false).next().value;
    const deleteOperations : DeleteOperation[] = triggerNodes.map(
      (node: FugueNode) => fugue.deleteLocalById(node.id)
    ).flat();

    const styleOperation = fugue.updateBlockStyleLocal(type, line);
    Transforms.setNodes(editor, { type }, { match: n => Element.isElement(n) && editor.isBlock(n), at: range });
    return [...deleteOperations, styleOperation];
  };
}

/**
 * Returns a function that applies an inline style to a block of text in the editor
 * @param key
 * @param triggerLength
 * @param fugue
 */
export function createSetInlineApply(key: InlineStyle, triggerLength: number, fugue: Fugue) {
  return (editor: Editor, range: Range) => {
    // remove trigger characters
    const selection = getSelectionByRange(editor, range, triggerLength);
    const deletions = deleteAroundSelection(selection, triggerLength, fugue);

    // update styles in the tree
    const newSelection = {
      start: { ...selection.start, column: selection.start.column - triggerLength },
      end: { ...selection.end, column: selection.end.column - triggerLength },
    };
    const operations = fugue.updateInlineStyleLocal(newSelection, true, key as InlineStyle);

    // apply styles in the editor
    Transforms.insertNodes(editor, { text: ' ' }, { match: Text.isText, at: Range.end(range), select: true });
    Transforms.setNodes(editor, { [key]: true }, { match: Text.isText, at: range, split: true });
    return [...deletions, ...operations];
  };
}

/**
 * Deletes characters around the selection
 * @param selection
 * @param amount
 * @param fugue
 */
function deleteAroundSelection(selection: Selection, amount: number, fugue: Fugue) : DeleteOperation[] {
  const idsToDelete: Id[] = [];

  range(1, amount, 1).forEach(i => {
    const cursorBefore = { line: selection.start.line, column: selection.start.column - i + 1 };
    const nodeBefore = fugue.getNodeByCursor(cursorBefore);
    const cursorAfter = { line: selection.end.line, column: selection.end.column + i };
    const nodeAfter = fugue.getNodeByCursor(cursorAfter);
    idsToDelete.push(nodeBefore?.id, nodeAfter?.id);
  });
  return idsToDelete.map(id => fugue.deleteLocalById(id)).flat();
}
