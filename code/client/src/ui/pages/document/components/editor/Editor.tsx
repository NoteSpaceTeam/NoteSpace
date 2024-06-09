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
import './Editor.scss';
import { useCallback, useEffect } from 'react';
import { isEqual } from 'lodash';
import { Connectors } from '@domain/editor/connectors/Connectors';

type SlateEditorProps = {
  title: string;
  fugue: Fugue;
  connectors: Connectors;
};

const initialValue: Descendant[] = [descendant('paragraph', '')];

function Editor({ title, connectors, fugue }: SlateEditorProps) {
  const [editor, setEditor] = useEditor(withHistory, withReact, getMarkdownPlugin(connectors.markdown));
  // Add editor customizations here
  const { cursors } = useCursors(connectors.service);
  const { renderElement, renderLeaf } = useRenderers(editor, fugue, connectors.service);
  const decorate = useDecorate(editor, cursors);

  // Editor syncing
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
      console.log('Syncing editor');
      const newSlate = slate || toSlate(fugue);
      updateEditor(newSlate);
    },
    [fugue, updateEditor]
  );

  // Syncs the editor with the Fugue on mount
  useEffect(() => {
    syncEditor();
  }, [syncEditor]);

  // Event handlers
  const { onInput, onShortcut, onCut, onPaste, onSelectionChange, onFormat, onBlur } = getEventHandlers(
    editor,
    connectors.input,
    connectors.markdown
  );

  // Misc hooks
  useHistory(editor, connectors.history);
  useEvents(editor, connectors.service, syncEditor);

  return (
    <div className="editor">
      <div className="container">
        <Slate
          editor={editor}
          onChange={() => {
            const slate = toSlate(fugue);
            if (!isEqual(slate, editor.children)) {
              // Prevents overwriting the editor with the same value
              syncEditor(slate);
            }
            onSelectionChange();
          }}
          initialValue={initialValue}
        >
          <Title title={title} placeholder="Untitled" connector={connectors.service} />
          <Toolbar onApplyMark={onFormat} />
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

export default Editor;
