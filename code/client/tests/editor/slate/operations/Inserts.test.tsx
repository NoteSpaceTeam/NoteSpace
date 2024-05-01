import { describe, test, expect, beforeEach } from 'vitest';
import { userEvent } from '@tests/test-utils';
import { setupEditor } from '../utils';

describe('Inserts', () => {
  let editor: HTMLElement;

  beforeEach(async () => {
    const { editorElement } = await setupEditor();
    editor = editorElement;
  });

  test('should display written text in the editor', async () => {
    await userEvent.type(editor, 'abc');
    expect(editor).toHaveTextContent('abc');
  });

  test('should allow to have multiple lines', async () => {
    await userEvent.type(editor, 'abc{enter}def');
    expect(editor).toHaveTextContent('abc def');
  });

  // test('should allow for text to be pasted', async () => {
  //   const text = 'Hello World!';
  //   await userEvent.paste(text);
  //   await waitFor(() => expect(editor).toHaveTextContent(text));
  // });

  // test('should allow to reload the page', async () => {
  //   await userEvent.type(editor, 'abc');
  //   document.location.reload();
  //   await waitFor(() => expect(editor).toHaveTextContent(''));
  // });

  // test('should allow to undo the last action', async () => {
  //   await userEvent.type(editor, 'abc'); // abc
  //   await userEvent.keyboard('{ctrl}z{/ctrl}');
  //   await waitFor(() => expect(editor).toHaveTextContent('')); // fails
  // });
});
