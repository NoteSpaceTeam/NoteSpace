import { type Editor } from 'slate';
import { useState } from 'react';
import { buildEditor } from '@editor/slate/utils/slate';

export default (editor?: Editor, ...plugins: Array<(editor: Editor) => Editor>): Editor =>
  useState(editor || buildEditor(...plugins))[0];
