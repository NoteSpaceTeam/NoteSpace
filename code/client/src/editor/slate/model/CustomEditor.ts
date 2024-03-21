import { Editor, Range } from 'slate';
import { type Style } from '@notespace/shared/crdt/styles.ts';
import { type StyleOperation } from '@notespace/shared/crdt/operations.ts';
import { socket } from '@src/socket/socket.ts';
import { type Fugue } from '@editor/crdt/fugue.ts';

/**
 * Gets the absolute indices of the current selection.
 * @param editor
 */
function getAbsoluteIndices(editor: Editor): [number, number] | null {
  const { selection } = editor;
  if (!selection) return null;
  const { anchor, focus } = selection;

  const anchorString = editor.string({
    anchor: editor.start([]),
    focus: anchor,
  });
  const focusString = editor.string({ anchor: editor.start([]), focus });

  const start = Range.isBackward(selection) ? focusString.length : anchorString.length;

  const end = Range.isBackward(selection) ? anchorString.length : focusString.length;

  return [start, end];
}

/**
 * Custom editor operations.
 */
const CustomEditor = {
  isMarkActive(editor: Editor, format: string) {
    const marks = Editor.marks(editor) as Partial<Record<string, boolean>>;
    return marks ? marks[format] : false;
  },
  toggleMark(editor: Editor, format: string, fugue: Fugue<string>) {
    const isActive = CustomEditor.isMarkActive(editor, format);
    if (isActive) Editor.removeMark(editor, format);
    else Editor.addMark(editor, format, true);

    const [start, end] = getAbsoluteIndices(editor)!;
    for (let i = start; i < end; i++) {
      const id = fugue.getElementId(i);
      console.log('id', id);
      if (!id) continue;
      const styleMessage: StyleOperation = {
        type: 'style',
        id,
        style: format as Style,
      }; // TODO: swap to chunked emition
      socket.emit('operation', styleMessage);
    }
  },
};

export default CustomEditor;
