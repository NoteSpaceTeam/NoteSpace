import { type Editor } from 'slate';
import { useState } from 'react';
import { buildEditor } from '@editor/slate/utils/slate';

const useEditor = (...plugins: Array<(editor: Editor) => Editor>): Editor =>
  useState(buildEditor(...plugins))[0];

export default useEditor;
