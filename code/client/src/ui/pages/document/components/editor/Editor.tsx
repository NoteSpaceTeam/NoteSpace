import { Descendant } from 'slate';
import { Editable, Slate, withReact } from 'slate-react';
import { descendant } from '@domain/editor/slate/utils/slate';
import { getMarkdownPlugin } from '@domain/editor/slate/plugins/markdown/withMarkdown';
import { Connectors } from '@domain/editor/connectors/Connectors';
import { Fugue } from '@domain/editor/fugue/Fugue';
import useEvents from '@ui/pages/document/components/editor/hooks/useEvents';
import useRenderers from '@ui/pages/document/components/editor/hooks/useRenderers';
import Toolbar from '@ui/pages/document/components/toolbar/Toolbar';
import Title from '@ui/pages/document/components/title/Title';
import useEditor from '@ui/pages/document/components/editor/hooks/useEditor';
import useDecorate from '@ui/pages/document/components/editor/hooks/useDecorate';
import useCursors from '@ui/pages/document/components/editor/hooks/useCursors';
import getEventHandlers from '@domain/editor/slate/operations/getEventHandlers';
import useEditorSync from '@ui/pages/document/components/editor/hooks/useEditorSync';
import './Editor.scss';

type EditorProps = {
  title: string;
  fugue: Fugue;
  connectors: Connectors;
};

const initialValue: Descendant[] = [descendant('paragraph', '')];

function Editor({ title, connectors, fugue }: EditorProps) {
  const [editor, setEditor] = useEditor(withReact, getMarkdownPlugin(connectors.markdown));
  const { cursors } = useCursors(connectors.service);
  const { renderElement, renderLeaf } = useRenderers(editor, fugue, connectors.service);
  const decorate = useDecorate(editor, cursors);
  const { syncEditor } = useEditorSync(fugue, setEditor);
  const { onInput, onShortcut, onCut, onPaste, onSelectionChange, onFormat, onBlur } = getEventHandlers(
    editor,
    connectors.input,
    connectors.markdown
  );
  useEvents(connectors.service, syncEditor);

  return (
    <div className="editor">
      <div className="container">
        <Slate editor={editor} onChange={() => onSelectionChange()} initialValue={initialValue}>
          <Title title={title} placeholder="Untitled" connector={connectors.service} />
          <Toolbar onApplyMark={onFormat} />
          <Editable
            className="editable"
            data-testid="editor"
            placeholder="Start writing..."
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

export default Editor;
