import { useMemo, useState } from 'react';
import { Descendant } from 'slate';
import { Editable, Slate, withReact } from 'slate-react';
import useInputHandlers from '@src/editor/hooks/useInputHandlers.ts';
import useFugue from '@src/editor/hooks/useFugue.ts';
import useEvents from '@src/editor/hooks/useEvents.ts';
import useRenderers from '@src/editor/slate/modules/hooks/useRenderers.tsx';
import './SlateEditor.scss';
import { Elements } from '@src/editor/slate/modules/Elements.ts';
import Toolbar from '@src/editor/slate/modules/toolbar/Toolbar.tsx';
import { withHistory } from 'slate-history';
import withShortcuts from '@src/editor/slate/modules/plugins/withShortcuts.ts';
import { descendant, descendantChildren } from '@src/editor/slate/modules/utils.ts';
import useEditor from '@src/editor/slate/modules/hooks/useEditor.ts';

function SlateEditor() {
  // Hooks
  const editor = useEditor(withHistory, withReact, withShortcuts);
  const [text, setText] = useState<string | undefined>();
  const fugue = useFugue();
  const { onKeyDown, onPaste } = useInputHandlers(editor, fugue);
  const { renderElement, renderLeaf } = useRenderers();

  const initialValue: Descendant[] = useMemo(() => [descendant(Elements.p, descendantChildren(text || ''))], [text]);

  useEvents(fugue, () => {
    const newText = fugue.toString();
    setText(newText);

    // force re-render of the editor with new text
    editor.children = [descendant(Elements.p, descendantChildren(newText))];
    editor.onChange();
  });

  return (
    <div className="editor">
      <header>
        <span className="fa fa-bars"></span>
        <h1>NoteSpace</h1>
      </header>
      <div className="container">
        <Slate editor={editor} initialValue={initialValue}>
          <Toolbar />
          <Editable
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            spellCheck={false}
            placeholder="Start writing..."
            onKeyDown={onKeyDown}
            onPaste={onPaste}
          />
        </Slate>
      </div>
    </div>
  );
}

export default SlateEditor;
