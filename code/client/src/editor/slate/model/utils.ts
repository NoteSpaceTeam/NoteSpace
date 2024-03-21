import { type Descendant, Editor, Range } from 'slate';
import { type CustomText } from '@editor/slate/model/types.ts';
import { type BlockType } from '@notespace/shared/crdt/styles';

/**
 * Creates a descendant object.
 * @param type
 * @param children
 * @returns
 */
export const createDescendant = (type: BlockType, children: CustomText[]): Descendant => {
  return { type, children };
};

/**
 * Creates an array of children for a descendant.
 * @param values
 */
export const createChildren = (...values: string[]): CustomText[] => {
  return values.map(value => {
    return { text: value };
  });
};

/**
 * Gets the absolute indices of the current selection.
 * @param editor
 */
export function getAbsoluteSelection(editor: Editor): [number, number] {
  const { selection } = editor;
  if (!selection) return [0, 0];
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
