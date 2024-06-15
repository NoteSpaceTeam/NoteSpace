import { Element, Text } from 'slate';
import { Fugue } from '@domain/editor/fugue/Fugue';
import { ReviveOperation } from '@notespace/shared/src/document/types/operations';
import { BlockStyle, getStyleType, InlineStyle } from '@notespace/shared/src/document/types/styles';
import { ServiceConnector } from '@domain/editor/connectors/service/connector';
import {
  ApplyHistory,
  HistoryConnector
} from '@domain/editor/connectors/history/types'
import {
  HistoryOperation,
  InsertNodeOperation,
  InsertTextOperation,
  MergeNodeOperation,
  RemoveNodeOperation,
  RemoveTextOperation,
  SetNodeOperation,
  SplitNodeOperation,
  UnsetNodeOperation,
} from '@domain/editor/shared/historyTypes';
import { Operation } from '@notespace/shared/src/document/types/operations';

export default (fugue: Fugue, servicesConnector: ServiceConnector): HistoryConnector => {
  const applyHistoryOperation: ApplyHistory = (operations: HistoryOperation[]) => {
    const communicationOperations = operations
      .reverse()
      .map(operation => getOperation(operation))
      .flat()
      .filter(operation => operation !== undefined && operation !== null);

    servicesConnector.emitOperations(communicationOperations as Operation[]);
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
      end: { ...cursor, column: cursor.column + text.length },
    };
    return fugue.reviveLocal(selection);
  }

  /**
   * Removes text
   * @param selection
   */
  const removeText = ({ selection }: RemoveTextOperation) => fugue.deleteLocal(selection);

  /**
   * Inserts a node
   * @param selection
   * @param lineOperation
   * @param node
   */
  function insertNode({ selection, lineOperation, node }: InsertNodeOperation) {
    // Whole line operation
    if (lineOperation) {
      // Revive line's root node
      if (!Element.isElement(node)) return;
      const reviveOperation = fugue.reviveLocalByCursor(selection.start) as ReviveOperation;
      const style = node.type;
      const styleOperation = fugue.updateBlockStyleLocal(selection.start.line, style as BlockStyle)
      return [reviveOperation, styleOperation];
    }

    const styles = Object.keys(node).filter(key => key !== 'text');
    if (!Text.isText(node)) return;

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
  const removeNode = ({ selection }: RemoveNodeOperation) => fugue.deleteLocal(selection);

  /**
   * Splits a node
   * @param cursor
   */
  const splitNode = ({ cursor }: SplitNodeOperation) => fugue.reviveLocalByCursor(cursor);

  /**
   * Merges a node
   * @param cursor
   */
  const mergeNode = ({ cursor }: MergeNodeOperation) => fugue.deleteLocalByCursor(cursor);

  /**
   * Sets a node
   * @param selection
   * @param properties
   * @param set_mode
   */
  function setNode({ selection, properties }: SetNodeOperation | UnsetNodeOperation, set_mode: boolean) {
    if (!Element.isElement(properties)) return;
    const type = properties.type;
    const styleType = getStyleType(type);

    return styleType === 'block'
      ? fugue.updateBlockStyleLocal(selection.start.line, type as BlockStyle)
      : fugue.updateInlineStyleLocal(selection, type as InlineStyle, set_mode);
  }

  return { applyHistoryOperation };
};
