import { Editable, Slate, withReact } from 'slate-react';
import useInputHandlers from '@editor/slate/hooks/useInputHandlers.ts';
import useFugue from '@editor/hooks/useFugue';
import useEvents from '@editor/hooks/useEvents';
import useRenderers from '@editor/slate/hooks/useRenderers';
import Toolbar from '@editor/slate/toolbar/Toolbar';
import { withHistory } from 'slate-history';
import useEditor from '@editor/slate/hooks/useEditor';
import { withMarkdown } from '@editor/slate/plugins/markdown/withMarkdown';
import { toSlate } from '@editor/slate/utils/toSlate';
import './SlateEditor.scss';

const initialValue = [
  {
    type: 'paragraph',
    children: [{ text: '' }],
  },
];

function SlateEditor() {
  const editor = useEditor(withHistory, withReact, withMarkdown);
  const fugue = useFugue();
  const { onKeyDown, onPaste, onCut, onSelect } = useInputHandlers(editor, fugue);
  const { renderElement, renderLeaf } = useRenderers();

  useEvents(fugue, () => {
    editor.children = toSlate(fugue);
    editor.onChange();
  });

  return (
    <div className="editor">
      <header>
        <span className="fa fa-bars"></span>
        <h1>NoteSpace</h1>
      </header>
      <div className="container">
        {/*<Cursors />*/}
        <Slate editor={editor} initialValue={initialValue}>
          <Toolbar fugue={fugue} />
          <Editable
            className="editable"
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            spellCheck={false}
            onDragStart={e => e.preventDefault()}
            placeholder={'Start writing...'}
            onKeyDown={onKeyDown}
            onPaste={onPaste}
            onCut={onCut}
            onSelect={onSelect}
          />
        </Slate>
      </div>
    </div>
  );
}

export default SlateEditor;
