import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@tests/test-utils';
import { mockCommunication } from '../../mocks/mockCommunication';
import SlateEditor from '@/ui/pages/editor/components/slate-editor/SlateEditor';
import { Fugue } from '@/domain/editor/crdt/fugue';

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
