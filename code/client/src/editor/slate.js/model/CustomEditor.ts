import { Editor } from 'slate';
import { type Fugue } from '@editor/crdt/fugue.ts';
import { getSelection } from '@editor/slate.js/utils/selection.ts';

/**
 * Custom editor operations.
 */
const CustomEditor = {
  isMarkActive(editor: Editor, format: string) {
    const marks = Editor.marks(editor) as Partial<Record<string, boolean>>;
    return marks ? marks[format] : false;
  },
  toggleMark(editor: Editor, mark: string, fugue: Fugue) {
    const isActive = CustomEditor.isMarkActive(editor, mark);
    Editor.addMark(editor, mark, !isActive);

    const selection = getSelection(editor)!;
    fugue.updateStyleLocal(selection, !isActive, mark);
  },
};

export default CustomEditor;
