import { Dispatch, SetStateAction, useCallback, useEffect } from 'react';
import { Descendant, Editor } from 'slate';
import { toSlate } from '@domain/editor/slate/utils/slate';
import { Fugue } from '@domain/editor/fugue/Fugue';

function useEditorSync(fugue: Fugue, setEditor: Dispatch<SetStateAction<Editor>>) {
  // editor syncing
  const updateEditor = useCallback(
    (newValue: Descendant[]) => {
      setEditor(prevState => {
        prevState.children = newValue;
        return prevState;
      });
    },
    [setEditor]
  );

  const syncEditor = useCallback(
    (slate?: Descendant[]) => {
      const newSlate = slate || toSlate(fugue);
      updateEditor(newSlate);
    },
    [fugue, updateEditor]
  );

  // syncs the editor with fugue on mount
  useEffect(() => {
    syncEditor();
  }, [syncEditor]);

  return { syncEditor };
}

export default useEditorSync;
