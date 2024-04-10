import { Editor } from 'slate';
import { Fugue } from '@editor/crdt/Fugue';
import { getSelection, isSelected } from '@editor/slate/utils/selection';
import { InlineStyle } from '@notespace/shared/types/styles';
import { Socket } from 'socket.io-client';

/**
 * Custom Editor for Inline Styles
 */
const CustomEditor = {
  isMarkActive(editor: Editor, format: string) {
    const marks = Editor.marks(editor) as Partial<Record<string, boolean>>;
    return marks ? marks[format] : false;
  },

  toggleMark(editor: Editor, socket : Socket, mark: string, fugue: Fugue) {
    const isActive = CustomEditor.isMarkActive(editor, mark);
    Editor.addMark(editor, mark, !isActive);

    const selected = isSelected(editor);
    if (!selected) return;
    const selection = getSelection(editor);
    socket.emitChunked('operation',
      fugue.updateInlineStyleLocal(selection, !isActive, mark as InlineStyle)
    );
  },

  resetMarks(editor: Editor) {
    const marks = Editor.marks(editor);
    if (marks) for (const mark in marks) Editor.removeMark(editor, mark);
  },

  getMarks(editor: Editor): string[] {
    const marks = Editor.marks(editor) as Partial<Record<string, boolean>>;
    return marks ? Object.keys(marks).filter(m => marks[m]) : [];
  },
};

export default CustomEditor;
