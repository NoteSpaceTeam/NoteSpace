import { type Editor } from 'slate';
import { useState } from 'react';
import { buildEditor } from '@editor/slate/utils/slate';

const useEditor = (editor?: Editor, ...plugins: Array<(editor: Editor) => Editor>): Editor =>
  useState(editor || buildEditor(...plugins))[0];

export default useEditor;
