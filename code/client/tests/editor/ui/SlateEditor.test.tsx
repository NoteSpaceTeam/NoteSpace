import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, userEvent } from '../../test-utils';
import SlateEditor from '@editor/slate/SlateEditor';

const EDITOR_PLACEHOLDER = 'Start writing...';

describe('SlateEditor', () => {
  let editor: HTMLElement;

  beforeEach(() => {
    const { container } = render(<SlateEditor />);
    editor = container.querySelector('.editable') as HTMLElement;
    editor.focus();
  });

  it('should render the editor', async () => {
    const h1Title = screen.getByText('NoteSpace');
    const documentTitle = screen.getByPlaceholderText('Untitled');
    await new Promise(resolve => setTimeout(resolve, 100));

    expect(h1Title).toBeInTheDocument();
    expect(documentTitle).toBeInTheDocument();
    expect(editor).toHaveTextContent(EDITOR_PLACEHOLDER);
  });

  it('should display written text in the editor', async () => {
    await userEvent.type(editor, 'abc');
    expect(editor).toHaveTextContent('abc');
  });

  it('should allow for text to be deleted', async () => {
    const text = 'abc';
    await userEvent.type(editor, text);
    await userEvent.type(editor, '{backspace}');
    expect(editor).toHaveTextContent('ab');

    await userEvent.type(editor, '{backspace}'.repeat(text.length));
    expect(editor).toHaveTextContent(EDITOR_PLACEHOLDER);
  });

  it('should allow to have multiple lines', async () => {
    await userEvent.type(editor, 'abc{enter}def');
    expect(editor).toHaveTextContent('abc def');
  });

  // it('should allow for text to be pasted', async () => {
  // const text = 'Hello World! This is a test.';
  // userEvent.setup();
  // await userEvent.paste(text);
  // fireEvent.paste(editor, { clipboardData: { getData: () => text } });
  // await new Promise(resolve => setTimeout(resolve, 1000));
  // const paste = createEvent.paste(editor, {
  //   clipboardData: {
  //     getData: () => 'text',
  //   },
  // });
  //
  // fireEvent(editor, paste);
  // expect(editor).toHaveTextContent(text);
  // await waitFor(() => expect(editor).toHaveTextContent(text));
  // });

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
