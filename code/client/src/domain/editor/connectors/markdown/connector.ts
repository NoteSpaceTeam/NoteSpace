import { BlockStyle, InlineStyle } from '@notespace/shared/src/document/types/styles';
import { Selection } from '@domain/editor/cursor';
import { Fugue } from '@domain/editor/fugue/Fugue';
import { Operation } from '@notespace/shared/src/document/types/operations';
import { isEqual } from 'lodash';
import { Id } from '@notespace/shared/src/document/types/types';
import { deleteAroundSelection } from '@domain/editor/connectors/markdown/utils';
import { ServiceConnector } from '@domain/editor/connectors/service/connector';
import { MarkdownConnector } from '@domain/editor/connectors/markdown/types';

export default (fugue: Fugue, serviceConnector: ServiceConnector): MarkdownConnector => {
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
      const idsToDelete: Id[] = nodes[0].map(node => node.id);
      const deleteOperations = fugue.deleteLocalById(cursor, ...idsToDelete);
      operations.push(...deleteOperations);
    }

    // apply block style
    const styleOperation = fugue.updateBlockStyleLocal(line, style);
    operations.push(styleOperation);

    // emit operations
    serviceConnector.emitOperations(operations);
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
    serviceConnector.emitOperations(operations);
  }

  function deleteBlockStyles(selection: Selection) {
    const { start, end } = selection;
    const inStartOfLine = isEqual(start, end) && start.column === 0;
    const isMultiLine = start.line !== end.line;
    if (inStartOfLine || isMultiLine) {
      const newSelection = start.column !== 0 ? { start: { line: start.line + 1, column: 0 }, end } : selection;
      const operations = fugue.updateBlockStylesLocalBySelection('paragraph', newSelection);
      serviceConnector.emitOperations(operations);
    }
  }

  return {
    applyBlockStyle,
    applyInlineStyle,
    deleteBlockStyles,
  };
};
