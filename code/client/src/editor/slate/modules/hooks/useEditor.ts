import { createEditor, Editor } from 'slate';
import { useMemo } from 'react';

const useEditor = (...fns: ((editor: Editor) => Editor)[]): Editor =>
  useMemo(() => fns.reduce((acc, fn) => fn(acc), createEditor()), []);

export default useEditor;
