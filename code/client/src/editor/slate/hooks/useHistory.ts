import { useEffect } from 'react';
import historyHandlers from '@editor/domain/document/history/operations';
import historyEvents from '@editor/slate/events/history/historyEvents';
import { Editor } from 'slate';
import { Fugue } from '@editor/crdt/fugue';
import { Communication } from '@editor/domain/communication';

function useHistory(editor: Editor, fugue: Fugue, communication: Communication) {
  const handlersHistory = historyHandlers(fugue, communication);
  const { undoOperation, redoOperation } = historyEvents(editor, handlersHistory);
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
