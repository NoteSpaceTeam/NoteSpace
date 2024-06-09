import { Editor } from 'slate';
import { last } from 'lodash';
import { toHistoryOperations } from '@domain/editor/slate/operations/history/toHistoryOperations';
import { HistoryConnector } from '@domain/editor/connectors/history/types';

export type Operations = {
  undoOperation: () => void;
  redoOperation: () => void;
};

/**
 * Handles undo and redo operations
 * @param editor
 * @param connector
 */
function historyHandlers(editor: Editor, connector: HistoryConnector): Operations {
  function undoOperation() {
    const { history } = editor;
    const operations = toHistoryOperations(editor, last(history.undos), true);
    connector.applyHistoryOperation(operations);
  }

  function redoOperation() {
    const { history } = editor;
    const operations = toHistoryOperations(editor, last(history.redos), false);
    connector.applyHistoryOperation(operations);
  }

  return { undoOperation, redoOperation };
}

export default historyHandlers;
