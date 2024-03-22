import { Editable, Slate, withReact } from 'slate-react';
import useInputHandlers from '@editor/slate/hooks/useInputHandlers';
import useFugue from '@editor/hooks/useFugue';
import useEvents from '@editor/hooks/useEvents';
import useRenderers from '@editor/slate/hooks/useRenderers';
import './SlateEditor.scss';
import Toolbar from '@editor/slate/toolbar/Toolbar';
import { withHistory } from 'slate-history';
import useEditor from '@editor/slate/hooks/useEditor';
import { withMarkdown } from '@editor/slate/plugins/markdown/withMarkdown';
import { withNormalize } from './plugins/normalize/withNormalize';
import { toSlate } from '@editor/slate/utils';

const initialValue = [
  {
    type: 'paragraph',
    children: [{ text: '' }],
  },
]

function SlateEditor() {
  const editor = useEditor(withHistory, withReact, withMarkdown, withNormalize);
  const fugue = useFugue();
  const { onKeyDown, onPaste } = useInputHandlers(editor, fugue);
  const { renderElement, renderLeaf } = useRenderers();

  useEvents(fugue, () => {
    editor.children = toSlate(fugue.traverseTree)
    editor.onChange();
  });

  return (
    <div className="editor">
      <header>
        <span className="fa fa-bars"></span>
        <h1>NoteSpace</h1>
      </header>
      <div className="container">
        <Slate editor={editor} initialValue={initialValue}>
          <Toolbar fugue={fugue} />
          <Editable
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            spellCheck={false}
            placeholder={'Start writing...'}
            onKeyDown={onKeyDown}
            onPaste={onPaste}
          />
        </Slate>
      </div>
    </div>
  );
}

export default SlateEditor;
