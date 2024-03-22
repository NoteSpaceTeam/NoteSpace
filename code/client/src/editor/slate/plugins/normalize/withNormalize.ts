import { Editor, Transforms } from 'slate';
import _, { isEmpty } from 'lodash';

// ensure editor always has at least one child.
export function withNormalize(editor: Editor) {
  const { normalizeNode } = editor;
  editor.normalizeNode = entry => {
    const [node] = entry;

    if (!Editor.isEditor(node) || !isEmpty(node.children)) {
      normalizeNode(entry);
      return;
    }
    Transforms.insertNodes(
      editor,
      {
        type: 'paragraph',
        children: [{ text: '' }],
      },
      { at: [0] }
    );
  };
  return editor;
}
