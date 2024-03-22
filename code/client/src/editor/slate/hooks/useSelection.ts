import { Editor } from 'slate';
import { Selection } from '../model/cursor';
import { isEqual } from 'lodash';

function isSelected(editor: Editor) {
  if (!editor.selection) return false;
  const { anchor, focus } = editor.selection;
  return isEqual(anchor.path, focus.path) || anchor.offset !== focus.offset;
}

function getSelection(editor: Editor): Selection {
  if (!editor.selection) return { start: { line: 0, column: 0 }, end: { line: 0, column: 0 } };
  const { anchor, focus } = editor.selection;
  console.log(anchor, focus)
  const {path: startLine, offset: startColumn} = focus
  const {path: endLine, offset: endColumn} = anchor
  return {start: { line: startLine[0], column: startColumn }, end: { line: endLine[0], column: endColumn }};
}

function useSelection(editor: Editor){
  return {
    isSelected : isSelected(editor),
    selection : getSelection(editor)
  }
} 

export default useSelection;