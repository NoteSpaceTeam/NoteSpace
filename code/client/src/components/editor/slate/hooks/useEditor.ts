import { type Editor } from 'slate';
import { useMemo } from 'react';
import { buildEditor } from '@src/components/editor/slate/utils/slate.ts';

function useEditor(...plugins: Array<(editor: Editor) => Editor>): Editor {
  return useMemo(() => buildEditor(...plugins), []); // eslint-disable-line react-hooks/exhaustive-deps
}

export default useEditor;
