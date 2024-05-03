import { type Editor } from 'slate';
import { useMemo } from 'react';
import { buildEditor } from '@/domain/editor/slate/utils/slate';

function useEditor(...plugins: Array<(editor: Editor) => Editor>): Editor {
  return useMemo(() => buildEditor(...plugins), []); // eslint-disable-line react-hooks/exhaustive-deps
}

export default useEditor;
