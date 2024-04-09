import { describe, it, expect, beforeEach } from 'vitest';
import { render, userEvent } from '../../test-utils';
import SlateEditor from '@editor/slate/SlateEditor';

const EDITOR_PLACEHOLDER = 'Start writing...';

describe('Deletions', () => {
  let editor: HTMLElement;

  beforeEach(async () => {
    const { findByTestId } = render(<SlateEditor />);
    editor = await findByTestId('editor'); // calls 'act' under the hood, but is more readable
    editor.focus();
  });

  it('should allow for text to be deleted', async () => {
    const text = 'abc';
    await userEvent.type(editor, text);
    await userEvent.type(editor, '{backspace}');
    expect(editor).toHaveTextContent('ab');

    await userEvent.type(editor, '{backspace}'.repeat(text.length));
    expect(editor).toHaveTextContent(EDITOR_PLACEHOLDER);
  });

  it('should allow for text to be cut', async () => {
    const text = 'abc';
    await userEvent.type(editor, text);
    await userEvent.type(editor, '{selectall}{cut}');
    expect(editor).toHaveTextContent(EDITOR_PLACEHOLDER);
  });

  it('should allow for text to be selected', async () => {
    const text = 'abc';
    await userEvent.type(editor, text);
    await userEvent.type(editor, '{selectall}');
    expect(editor).toHaveTextContent(text);
  });
});
