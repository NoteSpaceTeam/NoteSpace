import { Editor } from 'slate';
import { Operation as SlateOperation } from 'slate';
import { Fugue } from '@editor/crdt/Fugue';
import { getSelectionBySlate } from '@editor/slate/utils/selection';
import { last } from 'lodash';
import { Communication } from '@socket/communication';

export type HistoryOperations = {
  undo: () => void;
  redo: () => void;
};

/**
 * Handles undo and redo operations
 * @param editor
 * @param fugue
 * @param communication
 */
function historyEvents(editor: Editor, fugue: Fugue, communication: Communication): HistoryOperations {
  function undo() {
    const { history } = editor;
    const undo = last(history.undos);
    if (undo) {
      undo.operations.map(reverseOperation);
    }
  }
  function redo() {
    const { history } = editor;
    const redo = last(history.redos);
    if (redo) {
      redo.operations.map(reverseOperation);
    }
  }

  /**
   * Reverses the given operation
   * @param operation
   */
  function reverseOperation(operation: SlateOperation) {
    switch (operation.type) {
      case 'insert_text': {
        const selection = getSelectionBySlate(editor, operation.path, operation.offset);
        const operations = fugue.deleteLocal(selection);
        communication.emitChunked('operation', operations);
        break;
      }
      case 'remove_text': {
        const selection = getSelectionBySlate(editor, operation.path, operation.offset);
        const operations = fugue.insertLocal(selection.start, ...operation.text.split(''));
        communication.emitChunked('operation', operations);
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
