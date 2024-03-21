import { createEditor, type Editor } from 'slate';
import { useState } from 'react';

const useEditor = (...plugins: Array<(editor: Editor) => Editor>): Editor =>
  useState(plugins.reduce((acc, plugin) => plugin(acc), createEditor()))[0];

export default useEditor;
