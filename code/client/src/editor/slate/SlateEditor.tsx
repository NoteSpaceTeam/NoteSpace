import { Editable, Slate, withReact } from 'slate-react';
import useInputHandlers from '@editor/hooks/useInputHandlers.ts';
import useFugue from '@editor/hooks/useFugue.ts';
import useEvents from '@editor/hooks/useEvents.ts';
import useRenderers from '@editor/slate/hooks/useRenderers.tsx';
import './SlateEditor.scss';
import Toolbar from '@editor/slate/toolbar/Toolbar.tsx';
import { withHistory } from 'slate-history';
import useEditor from '@editor/slate/hooks/useEditor.ts';
import { withMarkdown } from '@editor/slate/plugins/markdown/withMarkdown.ts';
import { withNormalize } from '@editor/slate/plugins/normalize/withNormalize.ts';

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
