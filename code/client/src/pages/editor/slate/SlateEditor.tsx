import { toSlate } from '@pages/editor/slate/utils/slate.ts';
import { descendant } from '@pages/editor/slate/utils/slate.ts';
import { Editable, Slate, withReact } from 'slate-react';
import { withHistory } from 'slate-history';
import { Communication } from '@communication/communication.ts';
import { getMarkdownPlugin } from '@pages/editor/slate/plugins/markdown/withMarkdown.ts';
import useEvents from '@pages/editor/hooks/useEvents.ts';
import useRenderers from '@pages/editor/slate/hooks/useRenderers.tsx';
import Toolbar from '@pages/editor/components/toolbar/Toolbar.tsx';
import useEditor from '@pages/editor/slate/hooks/useEditor.ts';
import useHistory from '@pages/editor/slate/hooks/useHistory.ts';
import useDecorate from '@pages/editor/slate/hooks/useDecorate.ts';
import useCursors from '@pages/editor/slate/hooks/useCursors.ts';
import getEventHandlers from '@pages/editor/slate/handlers/getEventHandlers.ts';
import getFugueOperations from '@pages/editor/domain/document/fugue/operations.ts';
import './SlateEditor.scss';
import { Descendant } from 'slate';
import { Fugue } from '@pages/editor/crdt/fugue.ts';
import EditorTitle from '@pages/editor/components/title/EditorTitle.tsx';
import { useCallback, useEffect } from 'react';

type SlateEditorProps = {
  title?: string;
  fugue: Fugue;
  communication: Communication;
};

const initialValue: Descendant[] = [descendant('paragraph', '')];

function SlateEditor({ title, fugue, communication }: SlateEditorProps) {
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
          <EditorTitle title={title || ''} placeholder={'Untitled'} communication={communication} />
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

export default SlateEditor;
