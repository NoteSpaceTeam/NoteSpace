import { Descendant } from 'slate';
import { Editable, Slate, withReact } from 'slate-react';
import useRenderers from '@ui/pages/document/components/editor/hooks/useRenderers';
import useEditor from '@ui/pages/document/components/editor/hooks/useEditor';
import '../editor/Editor.scss';

type EditorProps = {
  descendants: Descendant[];
};

function EditorPreview({ descendants }: EditorProps) {
  const [editor] = useEditor(withReact);
  const { renderElement, renderLeaf } = useRenderers(editor);

  return (
    <div className="editor">
      <div className="container">
        <Slate editor={editor} initialValue={descendants}>
          <Editable
            className="editable"
            data-testid="editor"
            placeholder="Start writing..."
            spellCheck={false}
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            onDragStart={e => e.preventDefault()}
            readOnly={true}
          />
        </Slate>
      </div>
    </div>
  );
}

export default EditorPreview;
