import { Editable, Slate, withReact } from 'slate-react';
import useInputHandlers from '@editor/slate/hooks/useInputHandlers.ts';
import useEvents from '@editor/hooks/useEvents';
import useRenderers from '@editor/slate/hooks/useRenderers';
import Toolbar from '@editor/slate/toolbar/Toolbar';
import EditorTitle from '@editor/components/EditorTitle.tsx';
import { withHistory } from 'slate-history';
import useEditor from '@editor/slate/hooks/useEditor';
import { withMarkdown } from '@editor/slate/plugins/markdown/withMarkdown';
import { fugueToSlate } from '@editor/slate/utils/slate.ts';
import { descendant } from '@editor/slate/utils/slate.ts';
import './SlateEditor.scss';

function SlateEditor() {
  const editor = useEditor(withHistory, withReact, withMarkdown);
  const initialValue = [descendant('paragraph', '')];

  const { onKeyDown, onPaste, onCut, onSelect } = useInputHandlers(editor);
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
        {/*<Cursors />*/}
        <Slate editor={editor} initialValue={initialValue}>
          <Toolbar />
          <EditorTitle placeholder={'Untitled'} className={'title'} />
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
