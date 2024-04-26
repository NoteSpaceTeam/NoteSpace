import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '../../test-utils';
import { mockCommunication } from '../mocks/mockCommunication';
import SlateEditor from '@src/components/editor/slate/SlateEditor';
import { Fugue } from '@src/components/editor/crdt/fugue.ts';

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
