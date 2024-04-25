import { toSlate } from '@editor/slate/utils/slate';
import { descendant } from '@editor/slate/utils/slate';
import { Editable, Slate, withReact } from 'slate-react';
import { withHistory } from 'slate-history';
import { Communication } from '@editor/domain/communication';
import { getMarkdownPlugin } from '@editor/slate/plugins/markdown/withMarkdown';
import useEvents from '@editor/hooks/useEvents';
import useRenderers from '@editor/slate/hooks/useRenderers';
import Toolbar from '@editor/components/toolbar/Toolbar';
import EditorTitle from '@editor/components/title/EditorTitle';
import useEditor from '@editor/slate/hooks/useEditor';
import useFugue from '@editor/hooks/useFugue';
import useHistory from '@editor/slate/hooks/useHistory';
import useDecorate from '@editor/slate/hooks/useDecorate';
import useCursors from '@editor/slate/hooks/useCursors';
import getEventHandlers from '@editor/slate/handlers/getEventHandlers';
import getFugueOperations from '@editor/domain/document/fugue/operations';
import './SlateEditor.scss';
import { Descendant } from 'slate';

type SlateEditorProps = {
  communication: Communication;
};

const initialValue: Descendant[] = [descendant('paragraph', '')];

function SlateEditor({ communication }: SlateEditorProps) {
  const fugue = useFugue();
  const editor = useEditor(withHistory, withReact, getMarkdownPlugin(fugue, communication));
  const fugueOperations = getFugueOperations(fugue);
  const { cursors } = useCursors(communication);
  const { renderElement, renderLeaf } = useRenderers();
  const decorate = useDecorate(editor, cursors);
  const { onInput, onShortcut, onCut, onPaste, onSelectionChange, onFormat, onBlur } = getEventHandlers(
    editor,
    fugue,
    communication
  );

  useHistory(editor, fugue, communication);
  useEvents(fugueOperations, communication, () => {
    editor.children = toSlate(fugue);
    editor.onChange();
  });

  return (
    <div className="editor">
      <div className="container">
        <Slate editor={editor} initialValue={initialValue} onChange={onSelectionChange}>
          <Toolbar onApplyMark={onFormat} />
          <EditorTitle placeholder={'Untitled'} communication={communication} />
          <Editable
            className="editable"
            data-testid={'editor'}
            placeholder={'Start writing...'}
            spellCheck={false}
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            decorate={decorate}
            onDragStart={e => e.preventDefault()}
            onDOMBeforeInput={onInput}
            onCut={onCut}
            onPaste={e => onPaste(e.nativeEvent)}
            onKeyDown={e => onShortcut(e.nativeEvent)}
            onBlur={onBlur}
          />
        </Slate>
      </div>
    </div>
  );
}

export default SlateEditor;
