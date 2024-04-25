import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '../../test-utils';
import { mockCommunication } from '../mocks/mockCommunication';
import SlateEditor from '@editor/slate/SlateEditor';

describe('SlateEditor', () => {
  let editor: HTMLElement;

  beforeEach(async () => {
    const { findByTestId } = render(<SlateEditor communication={mockCommunication()} />);
    editor = await findByTestId('editor');
    editor.focus();
  });

  it('should render the editor', async () => {
    const documentTitle = screen.getByPlaceholderText('Untitled');
    expect(documentTitle).toBeInTheDocument();
  });
});
