import { Editor, Transforms } from 'slate';
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
  toggleMark(editor: Editor, mark : string, fugue: Fugue) {
    const isActive = CustomEditor.isMarkActive(editor, mark);
    Transforms.setNodes(editor, { [mark]: !isActive}, { match: n => Editor.isBlock(editor, n) });
   
    const [start, end] = getAbsoluteSelection(editor)!;
    fugue.updateStyleLocal(start, end, !isActive, mark);
  },
};

export default CustomEditor;
