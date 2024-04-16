import { Fugue } from '@editor/crdt/fugue';
import { Communication } from '@socket/communication';
import {
  HistoryHandlers,
  HistoryOperation,
  onInsertTextOperation,
  onRemoveTextOperation,
} from '@editor/domain/history/types';

export default (fugue: Fugue, communication: Communication): HistoryHandlers => {
  function onHistoryOperation(operation: HistoryOperation) {
    switch (operation.type) {
      case 'insert':
        onInsertTextOperation(operation);
        break;
      case 'remove':
        onRemoveTextOperation(operation);
        break;
      default:
        throw new Error('Invalid operation type');
    }
  }

  function onInsertTextOperation({ cursor, text }: onInsertTextOperation) {
    const operations = fugue.insertLocal(cursor, ...text);
    communication.emitChunked('operation', operations);
  }

  function onRemoveTextOperation({ selection }: onRemoveTextOperation) {
    const operations = fugue.deleteLocal(selection);
    communication.emitChunked('operation', operations);
  }

  return {
    onHistoryOperation,
  };
};
