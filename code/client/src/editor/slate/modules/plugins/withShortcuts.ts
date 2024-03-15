import { Editor, Transforms, Range, Point, Element } from 'slate';
import { ElementType } from '@src/editor/slate/modules/Elements.ts';

const shortcuts: Record<string, string> = {
  '*': 'list-item',
  '-': 'list-item',
  '+': 'list-item',
  '>': 'block-quote',
  '#': 'heading-one',
  '##': 'heading-two',
  '###': 'heading-three',
  '####': 'heading-four',
  '#####': 'heading-five',
  '######': 'heading-six',
} as const;

function withShortcuts(editor: Editor) {
  const { deleteBackward, insertText } = editor;

  editor.insertText = text => {
    const { selection } = editor;

    if (text)
      if (text === ' ' && selection && Range.isCollapsed(selection)) {
        const { anchor } = selection;

        const block = Editor.above(editor, {
          match: n => Element.isElement(n) && Editor.isBlock(editor, n),
        });

        const path = block ? block[1] : [];
        const start = Editor.start(editor, path);
        const range = { anchor, focus: start };
        const beforeText = Editor.string(editor, range);
        const type = shortcuts[beforeText];

        if (type !== undefined) {
          Transforms.select(editor, range);
          Transforms.delete(editor);
          Transforms.setNodes(
            editor,
            { type: type as ElementType },
            { match: n => Element.isElement(n) && Editor.isBlock(editor, n) }
          );
          return;
        }
      }

    insertText(text);
  };

  editor.deleteBackward = (...args) => {
    const { selection } = editor;

    if (selection && Range.isCollapsed(selection)) {
      const match = Editor.above(editor, {
        match: n => Element.isElement(n) && Editor.isBlock(editor, n),
      });

      if (match) {
        const [block, path] = match;
        const start = Editor.start(editor, path);

        if (Element.isElement(block) && block.type !== 'paragraph' && Point.equals(selection.anchor, start)) {
          Transforms.setNodes(editor, { type: 'paragraph' });

          if (block.type === 'list-item') {
            Transforms.unwrapNodes(editor, {
              match: n => Element.isElement(n) && n.type === 'bulleted-list',
              split: true,
            });
          }

          return;
        }
      }
      deleteBackward(...args);
    }
  };

  return editor;
}

export default withShortcuts;
