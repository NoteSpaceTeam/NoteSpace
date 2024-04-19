import { Fugue } from '@editor/crdt/fugue';
import { BlockStyle, InlineStyle } from '@notespace/shared/types/styles';
import { FugueNode } from '@editor/crdt/types';
import { Selection } from '@notespace/shared/types/cursor';
import { MarkdownDomainOperations } from '@editor/domain/document/markdown/types';
import { deleteAroundSelection } from '@editor/domain/document/markdown/utils';
import { Communication } from '@editor/domain/communication';
import { Operation } from '@notespace/shared/crdt/types/operations';
import { isSelectionEmpty } from '@editor/slate/utils/selection';

/**
 * Handlers for markdown operations
 * @param fugue
 * @param communication
 */
export default (fugue: Fugue, communication: Communication): MarkdownDomainOperations => {
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
      const cursor = { line, column: line === 0 ? 0 : 1 };
      const triggerNodes: FugueNode[] = fugue.traverseBySeparator(' ', cursor, false).next().value;
      const deleteOperations = triggerNodes.map(node => fugue.deleteLocalById(node.id)).flat();
      operations.push(...deleteOperations);
    }
    // apply block style
    const styleOperation = fugue.updateBlockStyleLocal(line, style);
    operations.push(styleOperation);

    // emit operations
    communication.emit('operation', operations);
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
    communication.emit('operation', operations);
  }

  function deleteBlockStyles(selection: Selection) {
    if (isSelectionEmpty(selection)) return;
    const { start, end } = selection;
    if (start.column === 0 || start.line !== end.line) {
      const newSelection = start.line !== end.line ? { start: { line: start.line + 1, column: 0 }, end } : selection;
      const operations = fugue.updateBlockStylesLocalBySelection('paragraph', newSelection);
      communication.emit('operation', operations);
    }
  }

  return {
    applyBlockStyle,
    applyInlineStyle,
    deleteBlockStyles,
  };
};
