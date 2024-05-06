import { describe, test, expect, beforeEach } from 'vitest';
import { userEvent } from '@tests/test-utils';
import { setupEditor } from '../utils';

const EDITOR_PLACEHOLDER = 'Start writing...';

describe('Deletions', () => {
  let editor: HTMLElement;

  beforeEach(async () => {
    const { editorElement } = await setupEditor();
    editor = editorElement;
  });

  test('should allow for text to be deleted', async () => {
    const text = 'abc';
    await userEvent.type(editor, text);
    await userEvent.type(editor, '{backspace}');
    expect(editor).toHaveTextContent('ab');

    await userEvent.type(editor, '{backspace}'.repeat(text.length));
    expect(editor).toHaveTextContent(EDITOR_PLACEHOLDER);
  });

  test('should allow for text to be cut', async () => {
    const text = 'abc';
    await userEvent.type(editor, text);
    await userEvent.type(editor, '{selectall}{cut}');
    expect(editor).toHaveTextContent(EDITOR_PLACEHOLDER);
  });

  test('should allow for text to be selected', async () => {
    const text = 'abc';
    await userEvent.type(editor, text);
    await userEvent.type(editor, '{selectall}');
    expect(editor).toHaveTextContent(text);
  });
});