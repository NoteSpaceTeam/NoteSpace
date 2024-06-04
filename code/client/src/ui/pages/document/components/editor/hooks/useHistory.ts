import { useEffect } from 'react';
import historyDomainOperations from '@domain/editor/fugue/operations/history/operations';
import historyOperations from '@domain/editor/slate/operations/history/operations';
import { Editor } from 'slate';
import { Fugue } from '@domain/editor/fugue/Fugue';
import { Communication } from '@services/communication/communication';

function useHistory(editor: Editor, fugue: Fugue, communication: Communication) {
  useEffect(() => {
    const { undo, redo } = editor;
    const domainOperations = historyDomainOperations(fugue, communication);
    const { undoOperation, redoOperation } = historyOperations(editor, domainOperations);

    editor.undo = () => {
      undoOperation();
      undo();
    };
    editor.redo = () => {
      redoOperation();
      redo();
    };
  }, [communication, editor, fugue]);
}

export default useHistory;
