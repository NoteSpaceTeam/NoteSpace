import { Editor } from 'slate';
import { last } from 'lodash';
import { HistoryDomainOperations } from '@pages/editor/domain/document/history/types.ts';
import { toHistoryOperations } from '@pages/editor/slate/handlers/history/utils.ts';

export type HistoryHandlers = {
  undoOperation: () => void;
  redoOperation: () => void;
};

/**
 * Handles undo and redo operations
 * @param editor
 * @param domainOperations
 */
function historyHandlers(editor: Editor, domainOperations: HistoryDomainOperations): HistoryHandlers {
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
