import { Editor, Range } from 'slate';
import { Style, StyleOperation } from '@notespace/shared/crdt/types';
import { socket } from '@src/socket/socket.ts';
import { Fugue } from '@src/editor/crdt/fugue.ts';

function getAbsoluteIndices(editor: Editor): [number, number] | null {
  const { selection } = editor;
  if (!selection) return null;
  const { anchor, focus } = selection;

  const start = Range.isBackward(selection)
    ? Editor.string(editor, { anchor: Editor.start(editor, []), focus: focus }).length
    : Editor.string(editor, { anchor: Editor.start(editor, []), focus: anchor }).length;

  const end = Range.isBackward(selection)
    ? Editor.string(editor, { anchor: Editor.start(editor, []), focus: anchor }).length
    : Editor.string(editor, { anchor: Editor.start(editor, []), focus: focus }).length;

  return [start, end];
}

const CustomEditor = {
  isMarkActive(editor: Editor, format: string) {
    const marks = Editor.marks(editor) as Partial<Record<string, boolean>>;
    return marks ? marks[format] : false;
  },
  toggleMark(editor: Editor, format: string, fugue: Fugue<string>) {
    const isActive = CustomEditor.isMarkActive(editor, format);
    if (isActive) {
      Editor.removeMark(editor, format);
    } else {
      Editor.addMark(editor, format, true);
    }
    const [start, end] = getAbsoluteIndices(editor)!;
    for (let i = start; i < end; i++) {
      const id = fugue.getElementId(i);
      if (!id) continue;
      const styleMessage: StyleOperation = {
        type: 'style',
        id,
        style: format as Style,
      };
      socket.emit('operation', styleMessage);
    }
  },
};

export default CustomEditor;
