import { toSlate } from '@editor/slate/utils/slate';
import { descendant } from '@editor/slate/utils/slate';
import { withReact } from 'slate-react';
import {Editor} from "slate";
import { withHistory } from 'slate-history';
import { withMarkdown } from '@editor/slate/plugins/markdown/withMarkdown';
import useEvents from '@editor/hooks/useEvents';
import useRenderers from '@editor/slate/hooks/useRenderers';
import useEditor from '@editor/slate/hooks/useEditor';
import getInputHandlers from '@editor/slate/events/getInputHandlers';
import markdownHandlers from '@editor/domain/document/markdown/operations';
import useCursors from './slate/hooks/useCursors';
import './SlateEditor.scss';
import useHistory from '@editor/slate/hooks/useHistory';
import {Fugue} from "@editor/crdt/fugue";
import {useMemo} from "react";
import SlateEditor from "@editor/slate/SlateEditor";
import {Communication} from "@editor/domain/communication";

// for testing purposes, we need to be able to pass in an editor
type SlateEditorProps = {
  editor?: Editor;
  communication: Communication;
};

const initialValue = [descendant('paragraph', '')];

function DocumentEditor({ editor: _editor, communication }: SlateEditorProps) {
  const fugue = useMemo(() => new Fugue(), []);
  const editor = useEditor(_editor, withHistory, withReact, editor => {
    const handlers = markdownHandlers(fugue, communication);
    return withMarkdown(editor, handlers);
  });
  //const { decorate } = useCursors(editor);
  const { getElementRenderer, getLeafRenderer } = useRenderers();
  const { onInput, onShortcut, onCut, onPaste, onCursorChange } = getInputHandlers(editor, fugue, communication);

  useHistory(editor, fugue);

  useEvents(fugue, () => {
    editor.children = toSlate(fugue);
    editor.onChange();
  });

  return (
    <div className="editor">
      <div className="container">
        <SlateEditor
            editor={editor}
            initialValue={initialValue}
            onCursorChange={onCursorChange}
            fugue={fugue}
            getElementRenderer={getElementRenderer}
            getLeafRenderer={getLeafRenderer}
            onInput={onInput}
            onCut={onCut}
            onPaste={onPaste}
            onShortcut={onShortcut}
        />
      </div>
    </div>
  );
}

export default DocumentEditor;
