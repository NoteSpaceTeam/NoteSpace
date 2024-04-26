import { Fugue } from '@editor/crdt/fugue';
import {
  ApplyHistory,
  HistoryDomainOperations,
  HistoryOperation,
  InsertNodeOperation,
  InsertTextOperation,
  MergeNodeOperation,
  RemoveNodeOperation,
  RemoveTextOperation,
  SetNodeOperation,
  SplitNodeOperation,
  UnsetNodeOperation,
} from '@editor/domain/document/history/types';
import { Communication } from '@editor/domain/communication';
import { BlockStyle, InlineStyle } from '@notespace/shared/types/styles';
import { getStyleType } from '@notespace/shared/types/styles';

export default (fugue: Fugue, communication: Communication): HistoryDomainOperations => {
  const applyHistoryOperation: ApplyHistory = (operations: HistoryOperation[]) => {
    const communicationOperations = operations
      .reverse()
      .map(operation => getOperation(operation))
      .flat()
      .filter(operation => operation !== undefined && operation !== null);

    communication.emitChunked('operation', communicationOperations);
  };

  function getOperation(operation: HistoryOperation) {
    switch (operation.type) {
      case 'insert_text':
        return insertText(operation as InsertTextOperation);
      case 'remove_text':
        return removeText(operation as RemoveTextOperation);
      case 'insert_node':
        return insertNode(operation as InsertNodeOperation);
      case 'remove_node':
        return removeNode(operation as RemoveNodeOperation);
      case 'split_node':
        return splitNode(operation as SplitNodeOperation);
      case 'merge_node':
        return mergeNode(operation as MergeNodeOperation);
      case 'set_node':
        return setNode(operation as SetNodeOperation, true);
      case 'unset_node':
        return setNode(operation as UnsetNodeOperation, false);
    }
  }

  /**
   * Inserts text
   * @param cursor
   * @param text
   */
  function insertText({ cursor, text }: InsertTextOperation) {
    const selection = {
      start: cursor,
      end: {
        ...cursor,
        column: cursor.column + (text.length > 1 ? text.length - 1 : 0),
      },
    };
    return fugue.reviveLocal(selection);
  }

  /**
   * Removes text
   * @param selection
   */
  function removeText({ selection }: RemoveTextOperation) {
    return fugue.deleteLocal(selection);
  }

  /**
   * Inserts a node
   * @param selection
   * @param node
   */
  function insertNode({ selection, node }: InsertNodeOperation) {
    const styles = Object.keys(node).filter(key => key !== 'text');
    if (!node.text) return;
    const reviveOperations = fugue.reviveLocal(selection);
    const styleOperations = styles.map(style => {
      const styleType = getStyleType(style);
      return styleType === 'block'
        ? fugue.updateBlockStyleLocal(selection.start.line, style as BlockStyle)
        : fugue.updateInlineStyleLocal(selection, style as InlineStyle, true);
    });
    return [...reviveOperations, styleOperations];
  }

  /**
   * Removes a node
   * @param selection
   */
  function removeNode({ selection }: RemoveNodeOperation) {
    return fugue.deleteLocal(selection);
  }

  /**
   * Splits a node
   * @param cursor
   */
  function splitNode({ cursor }: SplitNodeOperation) {
    return fugue.reviveLocalByCursor(cursor)
  }

  /**
   * Merges a node
   * @param cursor
   */
  function mergeNode({ cursor }: MergeNodeOperation) {
    return fugue.deleteLocalByCursor(cursor)
  }

  /**
   * Sets a node
   * @param selection
   * @param properties
   * @param set_mode
   */
  function setNode({ selection, properties }: SetNodeOperation | UnsetNodeOperation, set_mode: boolean) {
    const type = properties.type;
    const styleType = getStyleType(type);

    return styleType === 'block'
      ? fugue.updateBlockStyleLocal(selection.start.line, type as BlockStyle)
      : fugue.updateInlineStyleLocal(selection, type as InlineStyle, set_mode);
  }

  return {
    applyHistoryOperation,
  };
};
