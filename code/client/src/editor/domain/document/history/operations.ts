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
        return setNode(operation as SetNodeOperation);
      case 'unset_node':
        return unsetNode(operation as UnsetNodeOperation);
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
  }

  function removeNode({ selection }: RemoveNodeOperation) {
    return fugue.deleteLocal(selection);
  }

  function splitNode({ cursor }: SplitNodeOperation) {
    // const operations = fugue.splitNodeLocal(cursor);
  }

  function mergeNode({ cursor }: MergeNodeOperation) {
    return fugue.deleteLocal({ start: cursor, end: cursor });
  }

  function setNode({ selection, newProperties }: SetNodeOperation) {
    const type = Object.keys(newProperties)[0];
    const styleType = getStyleType(type);
    if (styleType === 'block') {
      return fugue.updateBlockStyleLocal(selection.start.line, type as BlockStyle);
    }

    if (styleType === 'inline') {
      return fugue.updateInlineStyleLocal(selection, type as InlineStyle, true);
    }
  }

  function unsetNode({ selection, newProperties }: UnsetNodeOperation) {
    const type = Object.keys(newProperties)[0];
    const styleType = getStyleType(type);
    if (styleType === 'block') {
      return fugue.updateBlockStyleLocal(selection.start.line, type as BlockStyle);
    }

    if (styleType === 'inline') {
      return fugue.updateInlineStyleLocal(selection, type as InlineStyle, false);
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
