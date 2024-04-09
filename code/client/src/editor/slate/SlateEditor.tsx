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
import './SlateEditor.scss';
import Cursors from '@editor/components/cursors/Cursors';
import { Editor } from 'slate';

type SlateEditorProps = { editor?: Editor };

function SlateEditor({ editor }: SlateEditorProps) {
  // For testing purposes, we need to be able to pass in an editor

  const internalEditor = useEditor(withHistory, withReact, withMarkdown);

  editor = editor || internalEditor;

  const initialValue = [descendant('paragraph', '')];

  const { onInput, onKeyDown, onPaste, onCut, onSelect } = useInputHandlers(editor);
  const { renderElement, renderLeaf } = useRenderers();

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
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            spellCheck={false}
            onDragStart={e => e.preventDefault()}
            placeholder={'Start writing...'}
            onKeyDown={onKeyDown}
            onDOMBeforeInput={onInput}
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
