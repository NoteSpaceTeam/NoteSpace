import { Descendant } from 'slate';
import { Editable, Slate, withReact } from 'slate-react';
import { withHistory } from 'slate-history';
import { toSlate } from '@domain/editor/slate/utils/slate';
import { descendant } from '@domain/editor/slate/utils/slate';
import { getMarkdownPlugin } from '@domain/editor/slate/plugins/markdown/withMarkdown';
import { Fugue } from '@domain/editor/fugue/Fugue';
import useEvents from '@ui/pages/document/components/editor/hooks/useEvents';
import useRenderers from '@ui/pages/document/components/editor/hooks/useRenderers';
import Toolbar from '@ui/pages/document/components/toolbar/Toolbar';
import Title from '@ui/pages/document/components/title/Title';
import useEditor from '@ui/pages/document/components/editor/hooks/useEditor';
import useHistory from '@ui/pages/document/components/editor/hooks/useHistory';
import useDecorate from '@ui/pages/document/components/editor/hooks/useDecorate';
import useCursors from '@ui/pages/document/components/editor/hooks/useCursors';
import getEventHandlers from '@domain/editor/slate/operations/getEventHandlers';
import { useCallback, useEffect } from 'react';
import { Connectors } from '@domain/editor/connectors/Connectors';
import './Editor.scss';
import { isEqual } from 'lodash';

type EditorProps = {
  title: string;
  fugue: Fugue;
  connectors: Connectors;
};

const initialValue: Descendant[] = [descendant('paragraph', '')];

function Editor({ title, connectors, fugue }: EditorProps) {
  const [editor, setEditor] = useEditor(withHistory, withReact, getMarkdownPlugin(connectors.markdown));
  const { cursors } = useCursors(connectors.service);
  const { renderElement, renderLeaf } = useRenderers(editor, fugue, connectors.service);
  const decorate = useDecorate(editor, cursors);

  // editor syncing
  const updateEditor = useCallback(
    (newValue: Descendant[]) => {
      setEditor(prevState => {
        prevState.children = newValue;
        return prevState;
      });
    },
    [setEditor]
  );

  const syncEditor = useCallback(
    (slate?: Descendant[]) => {
      const newSlate = slate || toSlate(fugue);
      updateEditor(newSlate);
    },
    [fugue, updateEditor]
  );

  // syncs the editor with fugue on mount
  useEffect(() => {
    syncEditor();
  }, [syncEditor]);

  // event handlers
  const { onInput, onShortcut, onCut, onPaste, onSelectionChange, onFormat, onBlur } = getEventHandlers(
    editor,
    connectors.input,
    connectors.markdown
  );

  useHistory(editor, connectors.history);
  useEvents(editor, connectors.service, syncEditor);

  return (
    <div className="editor">
      <div className="container">
        <Slate
          editor={editor}
          onValueChange={() => {
            const slate = toSlate(fugue);
            // prevents overwriting the editor with the same value
            if (!isEqual(slate, editor.children)) {
              syncEditor(slate);
            }
          }}
          onChange={() => onSelectionChange()}
          initialValue={initialValue}
        >
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
