import { Editor } from 'slate';
import { type Fugue } from '@editor/crdt/fugue.ts';
import { getAbsoluteSelection } from '@editor/slate/model/utils.ts';

/**
 * Custom editor operations.
 */
const CustomEditor = {
  isMarkActive(editor: Editor, format: string) {
    const marks = Editor.marks(editor) as Partial<Record<string, boolean>>;
    return marks ? marks[format] : false;
  },
  toggleMark(editor: Editor, format: string, fugue: Fugue) {
    const isActive = CustomEditor.isMarkActive(editor, format);
    if (isActive) {
      Editor.removeMark(editor, format);
    } else {
      Editor.addMark(editor, format, true);
    }
    const [start, end] = getAbsoluteSelection(editor)!;
    fugue.updateStyleLocal(start, end, !isActive, format);
  },
};

export default CustomEditor;
