import { useEffect } from 'react';
import historyOperations from '@domain/editor/slate/operations/history/operations';
import { Editor } from 'slate';
import { HistoryConnector } from '@domain/editor/connectors/history/types';

function useHistory(editor: Editor, historyConnector: HistoryConnector) {
  useEffect(() => {
    const { undo, redo } = editor;
    const { undoOperation, redoOperation } = historyOperations(editor, historyConnector);

    editor.undo = () => {
      undoOperation();
      undo();
    };
    editor.redo = () => {
      redoOperation();
      redo();
    };
  }, [editor, historyConnector]);
}

export default useHistory;
