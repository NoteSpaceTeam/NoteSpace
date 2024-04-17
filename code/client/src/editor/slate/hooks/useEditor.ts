import { type Editor } from 'slate';
import { useMemo } from 'react';
import { buildEditor } from '@editor/slate/utils/slate';

function useEditor(...plugins: Array<(editor: Editor) => Editor>): Editor {
  return useMemo(() => buildEditor(...plugins), [plugins]);
}

export default useEditor;
