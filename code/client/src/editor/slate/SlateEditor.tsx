import { Editor } from 'slate';
import { toSlate } from '@editor/slate/utils/slate';
import { descendant } from '@editor/slate/utils/slate';
import { Editable, Slate, withReact } from 'slate-react';
import { withHistory } from 'slate-history';
import { withMarkdown } from '@editor/slate/plugins/markdown/withMarkdown';
import useEvents from '@editor/hooks/useEvents';
import useRenderers from '@editor/slate/hooks/useRenderers';
import Toolbar from '@editor/components/toolbar/Toolbar';
import EditorTitle from '@editor/components/title/EditorTitle';
import useEditor from '@editor/slate/hooks/useEditor';
import useInputHandlers from '@editor/slate/hooks/useInputHandlers';
import useCommunication from '@editor/hooks/useCommunication';
import markdownHandlers from '@editor/domain/handlers/markdown/handlers';
import useFugue from '@editor/hooks/useFugue';
import useCursors from './hooks/useCursors';
import './SlateEditor.scss';
import useHistory from '@editor/slate/hooks/useHistory';

// for testing purposes, we need to be able to pass in an editor
type SlateEditorProps = {
  editor?: Editor;
};

const initialValue = [descendant('paragraph', '')];

function SlateEditor({ editor: _editor }: SlateEditorProps) {
  const fugue = useFugue();
  const communication = useCommunication();
  const editor = useEditor(_editor, withHistory, withReact, editor => {
    const handlers = markdownHandlers(fugue, communication);
    return withMarkdown(editor, handlers);
  });
  const { decorate } = useCursors(editor);
  const { getElementRenderer, getLeafRenderer } = useRenderers();
  const { onInput, onShortcut, onCut, onPaste, onCursorChange } = useInputHandlers(editor, fugue);

  useHistory(editor, fugue);
  useEvents(fugue, () => {
    editor.children = toSlate(fugue);
    editor.onChange();
  });

  return (
    <div className="editor">
      <div className="container">
        <Slate editor={editor} initialValue={initialValue} onChange={onCursorChange}>
          <Toolbar fugue={fugue} />
          <EditorTitle placeholder={'Untitled'} />
          <Editable
            className="editable"
            data-testid={'editor'}
            renderElement={getElementRenderer}
            renderLeaf={getLeafRenderer}
            decorate={decorate}
            spellCheck={false}
            onDragStart={e => e.preventDefault()}
            placeholder={'Start writing...'}
            onDOMBeforeInput={onInput}
            onCut={onCut}
            onPaste={e => onPaste(e.nativeEvent)}
            onKeyDown={e => onShortcut(e.nativeEvent)}
          />
        </Slate>
      </div>
    </div>
  );
}

export default SlateEditor;
