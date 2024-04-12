import { Communication } from '@socket/communication';
import { Fugue } from '@editor/crdt/Fugue';
import { BlockStyle, InlineStyle } from '@notespace/shared/types/styles';
import { FugueNode } from '@editor/crdt/types';
import { BlockStyleOperation, DeleteOperation, InlineStyleOperation } from '@notespace/shared/crdt/types/operations';
import { Selection } from '@notespace/shared/types/cursor';
import { MarkdownConnector } from '@editor/slate/plugins/markdown/connector/types';
import { deleteAroundSelection } from '@editor/slate/plugins/markdown/connector/utils';

/**
 * Connector for markdown operations.
 * @param fugue
 * @param communication
 */
export default (fugue : Fugue, communication : Communication) : MarkdownConnector => {

  /**
   * Applies a block style to the editor, and emits the operation to the server.
   * @param type
   * @param line
   */
  const blockCallback = (type : BlockStyle, line : number) => {
    const cursor = { line, column: 0 };
    const triggerNodes = fugue.traverseBySeparator(' ', cursor, false).next().value; // can't remove

    const deleteOperations: DeleteOperation[] = triggerNodes
      .map((node: FugueNode) => fugue.deleteLocalById(node.id))
      .flat();

    console.log(deleteOperations);
    communication.emitChunked('operation', deleteOperations);
    applyBlockStyle(type, line);
  }

  /**
   * Applies a block style to the editor.
   * @param type
   * @param line
   */
  const applyBlockStyle = (type : BlockStyle, line : number) => {
    const styleOperation = fugue.updateBlockStyleLocal(type, line);
    communication.emit('operation', styleOperation);
  }

  /**
   * Applies an inline style to the editor, and emits the operation to the server.
   * @param key
   * @param triggerLength
   * @param selection
   */
  const inlineCallback = (key: InlineStyle, triggerLength: number, selection : Selection) => {
    const deletions = deleteAroundSelection(selection, triggerLength, fugue);
    communication.emitChunked('operation', deletions);

    // update styles in the tree
    const updatedSelection : Selection = {
      start: { ...selection.start, column: selection.start.column - triggerLength },
      end: { ...selection.end, column: selection.end.column - triggerLength },
    };
    applyInlineStyle(key, updatedSelection);
  }

  /**
   * Applies an inline style to the editor.
   * @param key
   * @param selection
   */
  const applyInlineStyle = (key: InlineStyle, selection : Selection) => {
    communication.emitChunked('operation',
      fugue.updateInlineStyleLocal(selection, key as InlineStyle, true)
    );
  }

  const deleteCallback = (selection: Selection) => {
    const { start, end } = selection;
    const operations: (BlockStyleOperation | InlineStyleOperation | DeleteOperation)[] = [];
    if (start.column === 0 || start.line !== end.line) {
      const newSelection = start.line !== end.line ? { start: { line: start.line + 1, column: 0 }, end } : selection;
      const styleOperations = fugue.updateBlockStylesLocalBySelection('paragraph', newSelection);
      operations.push(...styleOperations);
    }

    communication.emitChunked('operation', operations);
  }

  return {
    applyBlockStyle,
    applyInlineStyle,
    blockCallback,
    inlineCallback,
    deleteCallback
  }
}
