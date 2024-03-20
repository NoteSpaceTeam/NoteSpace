import { Editable, Slate, withReact } from 'slate-react';
import useInputHandlers from '@src/editor/hooks/useInputHandlers.ts';
import useFugue from '@src/editor/hooks/useFugue.ts';
import useEvents from '@src/editor/hooks/useEvents.ts';
import useRenderers from '@src/editor/slate/hooks/useRenderers.tsx';
import './SlateEditor.scss';
import Toolbar from '@src/editor/slate/toolbar/Toolbar.tsx';
import { withHistory } from 'slate-history';
import useEditor from '@src/editor/slate/hooks/useEditor.ts';
import { withMarkdown } from '@src/editor/slate/markdown/withMarkdown.ts';
import { withNormalize } from '@src/editor/slate/normalize/withNormalize.ts';

function SlateEditor() {
  const editor = useEditor(withHistory, withReact, withMarkdown, withNormalize);
  const fugue = useFugue();
  const { onKeyDown, onPaste } = useInputHandlers(editor, fugue);
  const { renderElement, renderLeaf } = useRenderers();

  useEvents(fugue, () => {
    // force re-render of the editor with new text
    editor.children = fugue.toSlate();
    editor.onChange();
  });

  return (
    <div className="editor">
      <header>
        <span className="fa fa-bars"></span>
        <h1>NoteSpace</h1>
      </header>
      <div className="container">
        <Slate editor={editor} initialValue={[]}>
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
