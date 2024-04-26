import { useEffect } from 'react';
import historyDomainOperations from '@src/components/editor/domain/document/history/operations.ts';
import historyHandlers from '@src/components/editor/slate/handlers/history/historyHandlers.ts';
import { Editor } from 'slate';
import { Fugue } from '@src/components/editor/crdt/fugue.ts';
import { Communication } from '@src/communication/communication.ts';

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
