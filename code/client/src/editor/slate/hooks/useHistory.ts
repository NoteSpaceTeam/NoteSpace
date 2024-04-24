import {useEffect} from 'react';
import historyDomainOperations from '@editor/domain/document/history/operations';
import historyHandlers from '@editor/slate/handlers/history/historyHandlers';
import { Editor} from 'slate';
import { Fugue } from '@editor/crdt/fugue';
import { Communication } from '@editor/domain/communication';

function useHistory(editor: Editor, fugue: Fugue, communication: Communication) {
  useEffect(() => {
    const { undo, redo } = editor;
    const domainOperations = historyDomainOperations(fugue, communication);
    const { undoOperation, redoOperation } = historyHandlers(editor, domainOperations);

    editor.undo = () => {
      undoOperation();
      console.log("undoOperation");
        undo();
    };
    editor.redo = () => {
      redoOperation();
      console.log("redoOperation");
      redo();
    };
  },[communication, editor, fugue]);
}

export default useHistory;
