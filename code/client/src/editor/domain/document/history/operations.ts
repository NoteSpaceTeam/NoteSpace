import { Fugue } from '@editor/crdt/fugue';
import {
  ApplyHistory,
  HistoryDomainOperations,
  HistoryOperation,
  InsertTextOperation,
  RemoveTextOperation,
} from '@editor/domain/document/history/types';
import { Communication } from '@editor/domain/communication';
import { Cursor, Selection } from '@notespace/shared/types/cursor';
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
        return insertText(operation);
      case 'remove_text':
        return removeText(operation);
      case 'insert_node':
        return insertNode(operation.cursor, { type: 'paragraph', children: [{ text: '' }] });
      case 'remove_node':
        return removeNode(operation.cursor);
      case 'split_node':
        return splitNode(operation.cursor);
      case 'merge_node':
        return mergeNode(operation.cursor);
      case 'move_node':
        return moveNode(operation.cursor, operation.target);
      case 'set_node':
        return setNode(operation.selection, operation.newProperties);
      case 'set_selection':
        return setSelection(operation.properties, operation.newProperties);
    }
  }

  function insertText({ cursor, text }: InsertTextOperation) {
    return fugue.insertLocal(cursor, ...text);
  }

  function removeText({ selection }: RemoveTextOperation) {
    return fugue.deleteLocal(selection);
  }

  function insertNode(cursor: Cursor, node: Node) {
    // const operations = fugue.insertNodeLocal(cursor, node);
    // communication.emitChunked('operation', operations);
  }

  function removeNode(cursor: Cursor) {
    // const operations = fugue.removeNodeLocal(cursor);
    // communication.emitChunked('operation', operations);
  }

  function splitNode(cursor: Cursor) {
    // const operations = fugue.splitNodeLocal(cursor);
    // communication.emitChunked('operation', operations);
  }

  function mergeNode(cursor: Cursor) {
    // const operations = fugue.mergeNodeLocal(cursor);
    // communication.emitChunked('operation', operations);
  }

  function moveNode(cursor: Cursor, target: Cursor) {
    // const operations = fugue.moveNodeLocal(cursor, target);
    // communication.emitChunked('operation', operations);
  }

  function setNode(selection: Selection, properties: Partial<Node>) {
    const type = properties['type'];
    const styleType = getStyleType(type);
    if (styleType === 'block') {
      return fugue.updateBlockStyleLocal(selection.start.line, type as BlockStyle);
    }

    if (styleType === 'inline') {
      return fugue.updateInlineStyleLocal(selection, type as InlineStyle);
    }
  }

  function setSelection(properties: Partial<Range>, newProperties: Partial<Range>) {
    // const operations = fugue.setSelectionLocal(properties, newProperties);
    // communication.emitChunked('operation', operations);
  }

  return {
    applyHistoryOperation,
  };
};
