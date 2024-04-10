import { Editable, Slate, withReact } from 'slate-react';
import useInputHandlers from '@editor/slate/hooks/useInputHandlers';
import useEvents from '@editor/hooks/useEvents';
import useRenderers from '@editor/slate/hooks/useRenderers';
import Toolbar from '@editor/slate/toolbar/Toolbar';
import EditorTitle from '@editor/components/EditorTitle';
import { withHistory } from 'slate-history';
import useEditor from '@editor/slate/hooks/useEditor';
import { withMarkdown } from '@editor/slate/plugins/markdown/withMarkdown';
import { fugueToSlate } from '@editor/slate/utils/slate';
import { descendant } from '@editor/slate/utils/slate';
import Cursors from '@editor/components/cursors/Cursors';
import './SlateEditor.scss';
import { Editor } from 'slate';

// for testing purposes, we need to be able to pass in an editor
type SlateEditorProps = { editor?: Editor };

function SlateEditor({ editor: _editor }: SlateEditorProps) {
  const editor = useEditor(_editor, withHistory, withReact, withMarkdown);
  const initialValue = [descendant('paragraph', '')];
  const { onInput, onKeyDown, onPaste, onCut, onSelect } = useInputHandlers(editor);
  const { getElementRenderer, getLeafRenderer } = useRenderers();

  useEvents(() => {
    editor.children = fugueToSlate();
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
          <Cursors />
          <Toolbar />
          <EditorTitle placeholder={'Untitled'} />
          <Editable
            className="editable"
            data-testid={'editor'}
            renderElement={getElementRenderer}
            renderLeaf={getLeafRenderer}
            spellCheck={false}
            onDragStart={e => e.preventDefault()}
            placeholder={'Start writing...'}
            onDOMBeforeInput={onInput}
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
