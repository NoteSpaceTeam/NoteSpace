import { Fugue } from '@domain/editor/fugue/fugue';
import { BlockStyle, InlineStyle } from '@notespace/shared/src/document/types/styles';
import { FugueNode } from '@domain/editor/fugue/types';
import { Selection } from '@domain/editor/cursor';
import { MarkdownDomainOperations } from '@domain/editor/operations/markdown/types';
import { deleteAroundSelection } from '@domain/editor/operations/markdown/utils';
import { Communication } from '@services/communication/communication';
import { Operation } from '@notespace/shared/src/document/types/operations';
import { isSelectionEmpty } from '@domain/editor/slate/utils/selection';

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
      const nodes = Array.from(fugue.traverseBySeparator(' ', cursor, false, true));
      const triggerNodes: FugueNode[] = nodes[0];
      const deleteOperations = triggerNodes.map(node => fugue.deleteLocalById(node.id)).flat();
      operations.push(...deleteOperations);
    }

    // apply block style
    const styleOperation = fugue.updateBlockStyleLocal(line, style);
    operations.push(styleOperation);

    // emit operations
    socket.emit('operations', operations);
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
    socket.emit('operations', operations);
  }

  function deleteBlockStyles(selection: Selection) {
    if (isSelectionEmpty(selection)) return;
    const { start, end } = selection;

    // Remove block styles if the selection is single position at beginning of a line or multi-line selection
    if ((start === end && start.column === 0) || start.line !== end.line) {
      const newSelection = start.column !== 0 ? { start: { line: start.line + 1, column: 0 }, end } : selection;
      const operations = fugue.updateBlockStylesLocalBySelection('paragraph', newSelection);
      socket.emit('operations', operations);
    }
  }

  return {
    applyBlockStyle,
    applyInlineStyle,
    deleteBlockStyles,
  };
};
