import { Editor } from 'slate';
import { Fugue } from '@editor/crdt/fugue.ts';
import { getSelection } from '@editor/slate/utils/selection.ts';
import { InlineStyle } from '@notespace/shared/types/styles.ts';

/**
 * Custom editor operations.
 */
const CustomEditor = {
  isMarkActive(editor: Editor, format: string) {
    const marks = Editor.marks(editor) as Partial<Record<string, boolean>>;
    return marks ? marks[format] : false;
  },
  toggleMark(editor: Editor, mark: string) {
    const isActive = CustomEditor.isMarkActive(editor, mark);
    Editor.addMark(editor, mark, !isActive);

    const fugue = Fugue.getInstance();
    const selection = getSelection(editor);
    fugue.updateInlineStyleLocal(selection, !isActive, mark as InlineStyle);
  },
};

export default CustomEditor;
