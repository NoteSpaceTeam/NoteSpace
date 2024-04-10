import { Editor } from 'slate';
import { Operation as SlateOperation } from 'slate';
import { Fugue } from '@editor/crdt/fugue';
import { getSelectionBySlate } from '@editor/slate/utils/selection';

export type HistoryOperations = {
  undo: () => void;
  redo: () => void;
};

/**
 * Handles undo and redo operations
 * @param editor
 * @param fugue
 */
function historyEvents(editor: Editor, fugue: Fugue): HistoryOperations {
  function undo() {
    const { history } = editor;
    const undo = history.undos[history.undos.length - 1];
    if (undo) {
      undo.operations.map(applyOperation);
    }
  }
  function redo() {
    const { history } = editor;
    const redo = history.redos[history.redos.length - 1];
    if (redo) {
      redo.operations.map(applyOperation);
    }
  }

  function applyOperation(operation: SlateOperation) {
    switch (operation.type) {
      case 'insert_text': {
        const selection = getSelectionBySlate(editor, operation.path, operation.offset);
        fugue.deleteLocal(selection);
        break;
      }
      case 'remove_text': {
        const selection = getSelectionBySlate(editor, operation.path, operation.offset);
        fugue.insertLocal(selection.start, ...operation.text.split(''));
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
