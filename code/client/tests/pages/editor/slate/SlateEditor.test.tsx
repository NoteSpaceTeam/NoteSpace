import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@tests/test-utils.ts';
import { mockCommunication } from '../../../mocks/mockCommunication.ts';
import SlateEditor from '@pages/editor/slate/SlateEditor';
import { Fugue } from '@pages/editor/crdt/fugue.ts';

describe('SlateEditor', () => {
  const fugue = new Fugue();
  let editor: HTMLElement;

  beforeEach(async () => {
    const { findByTestId } = render(<SlateEditor fugue={fugue} communication={mockCommunication()} />);
    editor = await findByTestId('editor');
    editor.focus();
  });

  it('should render the editor', async () => {
    const documentTitle = screen.getByPlaceholderText('Untitled');
    expect(documentTitle).toBeInTheDocument();
  });
});