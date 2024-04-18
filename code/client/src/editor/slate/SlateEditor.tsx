import { toSlate } from '@editor/slate/utils/slate';
import { descendant } from '@editor/slate/utils/slate';
import { Editable, Slate, withReact } from 'slate-react';
import { withHistory } from 'slate-history';
import useEvents from '@editor/hooks/useEvents';
import useRenderers from '@editor/slate/hooks/useRenderers';
import Toolbar from '@editor/components/toolbar/Toolbar';
import EditorTitle from '@editor/components/title/EditorTitle';
import useEditor from '@editor/slate/hooks/useEditor';
import useFugue from '@editor/hooks/useFugue';
import useHistory from '@editor/slate/hooks/useHistory';
import getEventHandlers from '@editor/slate/handlers/getEventHandlers';
import getFugueHandlers from '@editor/domain/document/fugue/operations';
import { Communication } from '@editor/domain/communication';
import { getMarkdownPlugin } from '@editor/slate/plugins/markdown/withMarkdown';
import './SlateEditor.scss';

// for testing purposes, we need to be able to pass in an editor
type SlateEditorProps = {
  communication: Communication;
};

const initialValue = [descendant('paragraph', '')];

function SlateEditor({ communication }: SlateEditorProps) {
  const fugue = useFugue();
  const editor = useEditor(withHistory, withReact, getMarkdownPlugin(fugue, communication));
  // const { decorate } = useCursors(editor, communication);
  const { renderElement, renderLeaf } = useRenderers();
  const { onInput, onShortcut, onCut, onPaste, onCursorChange, onFormat } = getEventHandlers(
    editor,
    fugue,
    communication
  );
  const fugueHandlers = getFugueHandlers(fugue);

  useHistory(editor, fugue, communication);
  useEvents(fugueHandlers, communication, () => {
    editor.children = toSlate(fugue);
    editor.onChange();
  });

  return (
    <div className="editor">
      <div className="container">
        <Slate editor={editor} initialValue={initialValue} onChange={onCursorChange}>
          <Toolbar onApplyMark={onFormat} />
          <EditorTitle placeholder={'Untitled'} communication={communication} />
          <Editable
            className="editable"
            data-testid={'editor'}
            placeholder={'Start writing...'}
            spellCheck={false}
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            // decorate={decorate}
            onDragStart={e => e.preventDefault()}
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
