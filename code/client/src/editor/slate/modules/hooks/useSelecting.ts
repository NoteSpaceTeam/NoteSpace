import { useSlate } from 'slate-react';

function useSelecting() {
  const editor = useSlate();
  if (!editor.selection) return false;
  const { anchor, focus } = editor.selection;
  return JSON.stringify(anchor.path) !== JSON.stringify(focus.path) || anchor.offset !== focus.offset;
}

export default useSelecting;
