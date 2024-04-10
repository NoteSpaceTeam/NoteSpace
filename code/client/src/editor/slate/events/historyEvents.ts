import { Editor } from 'slate';
import { Operation as SlateOperation } from 'slate';
import { Fugue } from '@editor/crdt/Fugue';
import { getSelectionBySlate } from '@editor/slate/utils/selection';
import { Socket } from 'socket.io-client';
import { last } from 'lodash';

export type HistoryOperations = {
  undo: () => void;
  redo: () => void;
};

/**
 * Handles undo and redo operations
 * @param editor
 * @param fugue
 * @param socket
 */
function historyEvents(editor: Editor, fugue: Fugue, socket : Socket): HistoryOperations {
  function undo() {
    const { history } = editor;
    const undo = last(history.undos)
    if (undo) {
      undo.operations.map(applyOperation);
    }
  }
  function redo() {
    const { history } = editor;
    const redo = last(history.redos)
    if (redo) {
      redo.operations.map(applyOperation);
    }
  }

  function applyOperation(operation: SlateOperation) {
    switch (operation.type) {
      case 'insert_text': {
        const selection = getSelectionBySlate(editor, operation.path, operation.offset);
        socket.emitChunked('operation', fugue.deleteLocal(selection));
        break;
      }
      case 'remove_text': {
        const selection = getSelectionBySlate(editor, operation.path, operation.offset);
        socket.emitChunked('operation', fugue.insertLocal(selection.start, ...operation.text.split('')));
        break;
      }
      // other operation types
      default:
        throw new Error('Invalid operation type: ' + operation.type);
    }
  }

  return { undo, redo };
}

export default historyEvents;
