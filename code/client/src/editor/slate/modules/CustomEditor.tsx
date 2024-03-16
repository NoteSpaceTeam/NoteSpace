import { Editor } from 'slate';

const CustomEditor = {
  isMarkActive(editor: Editor, format: string) {
    const marks = Editor.marks(editor) as Partial<Record<string, boolean>>;
    return marks ? marks[format] : false;
  },
  toggleMark(editor: Editor, format: string) {
    const isActive = CustomEditor.isMarkActive(editor, format);
    if (isActive) {
      Editor.removeMark(editor, format);
    } else {
      Editor.addMark(editor, format, true);
    }
  },
};

export default CustomEditor;
