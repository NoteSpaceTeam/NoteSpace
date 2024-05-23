import { useEffect } from 'react';
import historyDomainOperations from '@domain/editor/operations/history/operations';
import historyHandlers from '@domain/editor/slate/handlers/history/historyHandlers';
import { Editor } from 'slate';
import { Fugue } from '@domain/editor/fugue/fugue';
import { Communication } from '@services/communication/communication';

function useHistory(editor: Editor, fugue: Fugue, communication: Communication) {
  useEffect(() => {
    const { undo, redo } = editor;
    const domainOperations = historyDomainOperations(fugue, communication);
    const { undoOperation, redoOperation } = historyHandlers(editor, domainOperations);

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
