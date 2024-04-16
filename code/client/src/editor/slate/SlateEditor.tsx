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
import useFugue from '../hooks/useFugue';
import useInputHandlers from '@editor/slate/hooks/useInputHandlers';
import useCommunication from '@editor/hooks/useCommunication';
import markdownHandlers from '@editor/domain/markdown/handlers';
import './SlateEditor.scss';

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
  const { getElementRenderer, getLeafRenderer } = useRenderers();
  const { onInput, onShortcut, onCut, onPaste, onSelect } = useInputHandlers(editor, fugue);

  useEvents(fugue, () => {
    editor.children = toSlate(fugue);
    editor.onChange();
  });

  return (
    <div className="editor">
      <div className="container">
        <Slate editor={editor} initialValue={initialValue}>
          {/*<Cursors />*/}
          <Toolbar fugue={fugue} />
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
            onCut={onCut}
            onPaste={e => onPaste(e.nativeEvent)}
            onKeyDown={e => onShortcut(e.nativeEvent)}
            onSelect={onSelect}
          />
        </Slate>
      </div>
    </div>
  );
}

export default SlateEditor;
