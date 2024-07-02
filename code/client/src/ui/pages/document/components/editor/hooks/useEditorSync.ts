import { Dispatch, SetStateAction, useCallback, useEffect } from 'react';
import { Editor } from 'slate';
import { toSlate } from '@domain/editor/slate/utils/slate';
import { Fugue } from '@domain/editor/fugue/Fugue';

function useEditorSync(fugue: Fugue, setEditor: Dispatch<SetStateAction<Editor>>) {
  const syncEditor = useCallback(() => {
    const newSlate = toSlate(fugue);
    setEditor(prevState => {
      prevState.children = newSlate;
      return prevState;
    });
  }, [fugue, setEditor]);

  // syncs the editor with fugue on mount
  useEffect(() => {
    syncEditor();
  }, [syncEditor]);

  return { syncEditor };
}

export default useEditorSync;
