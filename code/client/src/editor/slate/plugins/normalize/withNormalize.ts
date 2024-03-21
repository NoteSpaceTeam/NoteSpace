import { Editor, Transforms } from 'slate';

// ensure editor always has at least one child.
export function withNormalize(editor: Editor) {
  const { normalizeNode } = editor;
  editor.normalizeNode = entry => {
    const [node] = entry;
    if (!Editor.isEditor(node) || node.children.length > 0) {
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
