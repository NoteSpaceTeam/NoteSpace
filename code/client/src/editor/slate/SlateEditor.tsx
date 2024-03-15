import { useEffect, useMemo, useState } from 'react';
import { createEditor, Descendant } from 'slate';
import { Editable, Slate, withReact } from 'slate-react';
import useInputHandlers from '@src/editor/hooks/useInputHandlers.ts';
import useFugue from '@src/editor/hooks/useFugue.ts';
import useEvents from '@src/editor/hooks/useEvents.ts';
import CustomEditor from '@src/editor/slate/modules/CustomEditor.tsx';
import useRenderers from '@src/editor/slate/modules/Renderers.tsx';
import './SlateEditor.scss';

function SlateEditor() {
  const [editor] = useState(() => withReact(createEditor()));
  const [text, setText] = useState<string | undefined>();
  const fugue = useFugue();
  const { onKeyDown, onPaste, onSelect } = useInputHandlers(editor, fugue);
  const { renderElement, renderLeaf } = useRenderers();
  const initialValue: Descendant[] = useMemo(() => [{ type: 'paragraph', children: [{ text: text! }] }], [text]);

  useEvents(fugue, () => {
    const newText = fugue.toString();
    setText(newText);

    // force re-render of the editor with new text
    editor.children = [
      {
        type: 'paragraph',
        children: [{ text: newText }],
      },
    ];
    editor.onChange();
  });

  return (
    text !== undefined && (
      <div className="editor">
        <header>
          <span className="fa fa-bars"></span>
          <h1>NoteSpace</h1>
        </header>
        <div className="container">
          <Slate editor={editor} initialValue={initialValue}>
            <div>
              <button onClick={() => CustomEditor.toggleBoldMark(editor)}>Bold</button>
              <button onClick={() => CustomEditor.toggleCodeBlock(editor)}>Code Block</button>
            </div>
            <Editable
              renderElement={renderElement}
              renderLeaf={renderLeaf}
              onKeyDown={onKeyDown}
              onPaste={onPaste}
              onSelect={onSelect}
            />
          </Slate>
        </div>
      </div>
    )
  );
}

export default SlateEditor;
