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
  SetSelectionOperation,
  SplitNodeOperation,
} from '@editor/domain/document/history/types';
import { Communication } from '@editor/domain/communication';
import { Node } from 'slate';
import { BlockStyle, InlineStyle } from '@notespace/shared/types/styles';
import { getStyleType } from '@notespace/shared/types/styles';

export default (fugue: Fugue, communication: Communication): HistoryDomainOperations => {
  const applyHistoryOperation: ApplyHistory = (operations: HistoryOperation[]) => {
    const communicationOperations = operations
      .reverse()
      .map(operation => getOperation(operation))
      .flat();

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
        return setNode(operation as SetNodeOperation, (operation as SetNodeOperation).newProperties);
      case 'set_selection':
        return setSelection(operation as SetSelectionOperation);
    }
  }

  function insertText({ cursor, text }: InsertTextOperation) {
    //return fugue.insertLocal(cursor, ...text);
    // Enable nodes instead of creating new ones
    return fugue.reviveLocal(cursor, text.length);
  }

  function removeText({ selection }: RemoveTextOperation) {
    return fugue.deleteLocal(selection);
  }

  function insertNode({ cursor }: InsertNodeOperation) {
    // const operations = fugue.insertNodeLocal(cursor, node);
    // communication.emitChunked('operation', operations);
  }

  function removeNode({ cursor }: RemoveNodeOperation) {
    // const operations = fugue.removeNodeLocal(cursor);
    // communication.emitChunked('operation', operations);
  }

  function splitNode({ cursor }: SplitNodeOperation) {
    // const operations = fugue.splitNodeLocal(cursor);
    // communication.emitChunked('operation', operations);
  }

  function mergeNode({ cursor }: MergeNodeOperation) {
    const operations = fugue.removeLine(cursor.line);
    // communication.emitChunked('operation', operations);
  }

  function setNode({ selection }: SetNodeOperation, newProperties: Partial<Node>) {
    const type = newProperties.type;
    const styleType = getStyleType(type);
    if (styleType === 'block') {
      return fugue.updateBlockStyleLocal(selection.start.line, type as BlockStyle);
    }

    if (styleType === 'inline') {
      return fugue.updateInlineStyleLocal(selection, type as InlineStyle);
    }
  }

  function setSelection({ properties, newProperties }: SetSelectionOperation) {
    // const operations = fugue.setSelectionLocal(properties, newProperties);
    // communication.emitChunked('operation', operations);
  }

  return {
    applyHistoryOperation,
  };
};
