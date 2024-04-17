import { Fugue } from '@editor/crdt/fugue';
import {
  HistoryHandlers,
  HistoryOperation,
  onInsertTextOperation,
  onRemoveTextOperation,
} from '@editor/domain/document/history/types';
import { Communication } from '@editor/domain/communication';

export default (fugue: Fugue, communication: Communication): HistoryHandlers => {
  function applyHistoryOperation(operation: HistoryOperation) {
    switch (operation.type) {
      case 'insert_text':
        insertText(operation);
        break;
      case 'remove_text':
        removeText(operation);
        break;
      default:
        throw new Error('Invalid operation type');
    }
  }

  function insertText({ cursor, text }: onInsertTextOperation) {
    const operations = fugue.insertLocal(cursor, ...text);
    communication.emitChunked('operation', operations);
  }

  function removeText({ selection }: onRemoveTextOperation) {
    const operations = fugue.deleteLocal(selection);
    communication.emitChunked('operation', operations);
  }

  return {
    applyHistoryOperation,
  };
};
