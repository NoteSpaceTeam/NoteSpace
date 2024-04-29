import { useEffect } from 'react';
import historyDomainOperations from '@pages/editor/domain/document/history/operations.ts';
import historyHandlers from '@pages/editor/slate/handlers/history/historyHandlers.ts';
import { Editor } from 'slate';
import { Fugue } from '@pages/editor/crdt/fugue.ts';
import { Communication } from '@communication/communication.ts';

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
