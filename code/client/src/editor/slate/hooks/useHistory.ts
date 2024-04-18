import { useEffect } from 'react';
import historyDomainOperations from '@editor/domain/document/history/operations';
import historyHandlers from '@editor/slate/handlers/history/historyHandlers';
import { Editor } from 'slate';
import { Fugue } from '@editor/crdt/fugue';
import { Communication } from '@editor/domain/communication';

function useHistory(editor: Editor, fugue: Fugue, communication: Communication) {
  const domainOperations = historyDomainOperations(fugue, communication);
  const { undoOperation, redoOperation } = historyHandlers(editor, domainOperations);
  const { undo, redo } = editor;

  useEffect(() => {
    editor.undo = () => {
      undoOperation();
      undo();
    };
    editor.redo = () => {
      redoOperation();
      redo();
    };
  }, [editor, undo, redo, undoOperation, redoOperation]);
}

export default useHistory;
