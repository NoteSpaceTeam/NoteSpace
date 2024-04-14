import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '../../test-utils';
import { CommunicationProvider } from '@editor/contexts/CommunicationContext';
import SlateEditor from '@editor/slate/SlateEditor';

const EDITOR_PLACEHOLDER = 'Start writing...';
const mockHandler = () => {};

describe('SlateEditor', () => {
  let editor: HTMLElement;

  beforeEach(async () => {
    const { findByTestId } = render(
      <CommunicationProvider emit={mockHandler} emitChunked={mockHandler} on={mockHandler} off={mockHandler}>
        <SlateEditor />
      </CommunicationProvider>
    );
    editor = await findByTestId('editor'); // calls 'act' under the hood, but is more readable
    editor.focus();
  });

  it('should render the editor', async () => {
    const documentTitle = screen.getByPlaceholderText('Untitled');
    expect(documentTitle).toBeInTheDocument();
    expect(editor).toHaveTextContent(EDITOR_PLACEHOLDER);
  });
});
