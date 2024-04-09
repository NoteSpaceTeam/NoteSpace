import { describe, it, beforeAll, afterEach, expect } from 'vitest';
import { BlockStyles } from '@notespace/shared/types/styles';
import { cleanupEditor, setupEditor } from '../utils';
import { Editor } from 'slate';
import { withReact } from 'slate-react';
import { withHistory } from 'slate-history';
import { withMarkdown } from '@editor/slate/plugins/markdown/withMarkdown';
import { buildEditor } from '@editor/slate/utils/slate';

let slate: HTMLElement;
let editor: Editor;
let user: any;

beforeAll(async () => {
  editor = buildEditor(withHistory, withReact, withMarkdown);
  const { user : newUser, editorElement } = await setupEditor(editor);
  slate = editorElement;
  user = newUser;
});

afterEach(async () => {
  await cleanupEditor();
});

describe('Insert style - should render on both clients', () => {
  Object.keys(BlockStyles).forEach(style => {
    it(`should insert ${style} style and render on both clients`, () => {
      user.type(slate, '# Hello World');
      // Slate
      expect(slate).toHaveTextContent('Hello World');

    });
  });
});
