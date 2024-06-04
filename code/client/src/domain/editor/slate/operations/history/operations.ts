import { Editor } from 'slate';
import { last } from 'lodash';
import { HistoryDomainOperations } from '@domain/editor/fugue/operations/history/types';
import { toHistoryOperations } from '@domain/editor/slate/operations/history/toHistoryOperations';

export type Operations = {
  undoOperation: () => void;
  redoOperation: () => void;
};

/**
 * Handles undo and redo operations
 * @param editor
 * @param domainOperations
 */
function historyHandlers(editor: Editor, domainOperations: HistoryDomainOperations): Operations {
  function undoOperation() {
    const { history } = editor;
    domainOperations.applyHistoryOperation(toHistoryOperations(editor, last(history.undos), true));
  }

  function redoOperation() {
    const { history } = editor;
    domainOperations.applyHistoryOperation(toHistoryOperations(editor, last(history.redos), false));
  }

  return { undoOperation, redoOperation };
}

export default historyHandlers;
