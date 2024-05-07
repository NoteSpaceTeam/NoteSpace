import { useCallback, useEffect } from 'react';
import { Descendant } from 'slate';
import { Editable, Slate, withReact } from 'slate-react';
import { withHistory } from 'slate-history';
import { toSlate } from '@domain/editor/slate/utils/slate';
import { descendant } from '@domain/editor/slate/utils/slate';
import { Communication } from '@domain/communication/communication';
import { getMarkdownPlugin } from '@domain/editor/slate/plugins/markdown/withMarkdown';
import { Fugue } from '@domain/editor/crdt/fugue';
import useEvents from '@domain/editor/hooks/useEvents';
import useRenderers from '@domain/editor/slate/hooks/useRenderers';
import Toolbar from '@ui/pages/document/components/toolbar/Toolbar';
import Title from '@ui/pages/document/components/title/Title';
import useEditor from '@domain/editor/slate/hooks/useEditor';
import useHistory from '@domain/editor/slate/hooks/useHistory';
import useDecorate from '@domain/editor/slate/hooks/useDecorate';
import useCursors from '@domain/editor/slate/hooks/useCursors';
import getEventHandlers from '@domain/editor/slate/handlers/getEventHandlers';
import getFugueOperations from '@domain/editor/operations/fugue/operations';
import './Editor.scss';

type SlateEditorProps = {
  title?: string;
  fugue: Fugue;
  communication: Communication;
};

const initialValue: Descendant[] = [descendant('paragraph', '')];

function Editor({ title, fugue, communication }: SlateEditorProps) {
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

  const refreshEditor = useCallback(() => {
    editor.children = toSlate(fugue);
    editor.onChange();
  }, [editor, fugue]);

  useEffect(() => {
    refreshEditor();
  }, [refreshEditor]);

  useHistory(editor, fugue, communication);
  useEvents(fugueOperations, communication, refreshEditor);

  return (
    <div className="editor">
      <div className="container">
        <Slate editor={editor} initialValue={initialValue} onChange={onSelectionChange}>
          <Title title={title || ''} placeholder={'Untitled'} communication={communication} />
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
