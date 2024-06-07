import { type Editor } from 'slate';
import { useState} from 'react';
import { buildEditor } from '@domain/editor/slate/utils/slate';

function useEditor(...plugins: Array<(editor: Editor) => Editor>) {
  return useState(() => buildEditor(...plugins)); // eslint-disable-line react-hooks/exhaustive-deps
}

export default useEditor;
