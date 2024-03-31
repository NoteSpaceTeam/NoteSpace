import { type Editor, Element, Range, Text, Transforms } from 'slate';
import { Fugue } from '@editor/crdt/fugue';
import { Id, Node } from '@notespace/shared/crdt/types/nodes';
import { getSelectionByRange } from '@editor/slate/utils/selection';
import { BlockStyle, InlineStyle } from '@notespace/shared/types/styles';
import { Selection } from '@notespace/shared/types/cursor';

/**
 * Creates a function that applies a block element to the editor
 * @param type
 */
export function createSetBlockApply(type: BlockStyle) {
  const fugue = Fugue.getInstance();
  return (editor: Editor, range: Range) => {
    const line = range.anchor.path[0];

    // remove trigger characters
    const triggerNodes = fugue.traverseBySeparator(' ', line).next().value;
    triggerNodes.forEach((node: Node<string>) => fugue.deleteLocalById(node.id));

    // update styles in the tree
    fugue.updateBlockStyleLocal(type, line);

    // apply styles to the editor
    Transforms.setNodes(editor, { type }, { match: n => Element.isElement(n) && editor.isBlock(n), at: range });
  };
}

/**
 * Returns a function that applies an inline style to a block of text in the editor
 * @param key
 * @param triggerLength
 */
export function createSetInlineApply(key: InlineStyle, triggerLength: number) {
  const fugue = Fugue.getInstance();
  return (editor: Editor, range: Range) => {
    // remove trigger characters
    const selection = getSelectionByRange(range, triggerLength);
    deleteAroundSelection(selection, triggerLength);

    // update styles in the tree
    const newSelection = {
      start: { line: selection.start.line, column: selection.start.column - triggerLength },
      end: { line: selection.end.line, column: selection.end.column - triggerLength },
    };
    fugue.updateInlineStyleLocal(newSelection, true, key as InlineStyle);

    // apply styles to the editor
    Transforms.insertNodes(editor, { text: ' ' }, { match: Text.isText, at: Range.end(range), select: true });
    Transforms.setNodes(editor, { [key]: true }, { match: Text.isText, at: range, split: true });
  };
}

function deleteAroundSelection(selection: Selection, amount: number) {
  const fugue = Fugue.getInstance();
  const idsToDelete: Id[] = [];

  // get characters before the selection
  for (let i = 1; i <= amount; i++) {
    const cursor = { line: selection.start.line, column: selection.start.column - i + 1 };
    const node = fugue.getNodeByCursor(cursor);
    if (!node) break;
    idsToDelete.push(node.id);
  }
  // get characters after the selection
  for (let i = 1; i <= amount; i++) {
    const cursor = { line: selection.end.line, column: selection.end.column + i };
    const node = fugue.getNodeByCursor(cursor);
    if (!node) break;
    idsToDelete.push(node.id);
  }
  // delete the nodes
  idsToDelete.forEach(id => fugue.deleteLocalById(id));
}
