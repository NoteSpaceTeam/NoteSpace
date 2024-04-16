import { useEffect } from 'react';
import historyHandlers from '@editor/domain/handlers/history/handlers';
import historyEvents from '@editor/slate/events/historyEvents';
import { Editor } from 'slate';
import useCommunication from '@editor/hooks/useCommunication';
import { Fugue } from '@editor/crdt/fugue';

function useHistory(editor: Editor, fugue: Fugue) {
  const communication = useCommunication();
  const handlersHistory = historyHandlers(fugue, communication);
  const { onUndo, onRedo } = historyEvents(editor, handlersHistory);
  const { undo, redo } = editor;

  useEffect(() => {
    editor.undo = () => {
      onUndo();
      undo();
    };
    editor.redo = () => {
      onRedo();
      redo();
    };
  }, [editor, onRedo, onUndo, redo, undo]);
}

export default useHistory;
