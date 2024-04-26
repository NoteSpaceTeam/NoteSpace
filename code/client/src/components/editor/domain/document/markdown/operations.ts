import { Fugue } from '@src/components/editor/crdt/fugue.ts';
import { BlockStyle, InlineStyle } from '@notespace/shared/types/styles.ts';
import { FugueNode } from '@src/components/editor/crdt/types.ts';
import { Selection } from '@notespace/shared/types/cursor.ts';
import { MarkdownDomainOperations } from '@src/components/editor/domain/document/markdown/types.ts';
import { deleteAroundSelection } from '@src/components/editor/domain/document/markdown/utils.ts';
import { Communication } from '@src/communication/communication.ts';
import { Operation } from '@notespace/shared/crdt/types/operations.ts';
import { isSelectionEmpty } from '@src/components/editor/slate/utils/selection.ts';

/**
 * Handlers for markdown operations
 * @param fugue
 * @param communication
 */
export default (fugue: Fugue, { socket }: Communication): MarkdownDomainOperations => {
  /**
   * Applies a block style to the editor, and emits the operation to the server.
   * @param style
   * @param line
   * @param deleteTriggerNodes
   */
  function applyBlockStyle(style: BlockStyle, line: number, deleteTriggerNodes: boolean = false) {
    const operations: Operation[] = [];

    // delete trigger nodes
    if (deleteTriggerNodes) {
      const cursor = { line, column: 0 };
      const triggerNodes: FugueNode[] = fugue.traverseBySeparator(' ', cursor, false, true).next().value;
      const deleteOperations = triggerNodes.map(node => fugue.deleteLocalById(node.id)).flat();
      operations.push(...deleteOperations);
    }
    // apply block style
    const styleOperation = fugue.updateBlockStyleLocal(line, style);
    operations.push(styleOperation);

    // emit operations
    socket.emit('operation', operations);
  }

  /**
   * Applies an inline style to the editor, and emits the operation to the server.
   * @param style
   * @param triggerLength
   * @param selection
   * @param value
   */
  function applyInlineStyle(style: InlineStyle, selection: Selection, value: boolean, triggerLength: number = 0) {
    const operations: Operation[] = [];

    // delete trigger nodes
    if (triggerLength > 0) {
      const deleteOperations = deleteAroundSelection(selection, triggerLength, fugue);
      operations.push(...deleteOperations);
      selection = {
        start: { ...selection.start, column: selection.start.column - triggerLength },
        end: { ...selection.end, column: selection.end.column - triggerLength },
      };
    }
    // apply inline style
    const styleOperations = fugue.updateInlineStyleLocal(selection, style, value);
    operations.push(...styleOperations);

    // emit operations
    socket.emit('operation', operations);
  }

  function deleteBlockStyles(selection: Selection) {
    if (isSelectionEmpty(selection)) return;
    const { start, end } = selection;
    if (start.column === 0 || start.line !== end.line) {
      const newSelection = start.column !== 0 ? { start: { line: start.line + 1, column: 0 }, end } : selection;
      const operations = fugue.updateBlockStylesLocalBySelection('paragraph', newSelection);
      socket.emit('operation', operations);
    }
  }

  return {
    applyBlockStyle,
    applyInlineStyle,
    deleteBlockStyles,
  };
};
