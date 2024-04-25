import { createEditor, Descendant, Editor } from 'slate';
import type { BlockStyle, InlineStyle } from '@notespace/shared/types/styles';
import type { CustomText } from '@editor/slate/types';
import { isEqual, last } from 'lodash';
import { Fugue } from '@editor/crdt/fugue';
import { BlockStyles } from '@notespace/shared/types/styles';

/**
 * Converts a FugueTree to a Slate document
 */
export function toSlate(fugue: Fugue): Descendant[] {
  const descendants: Descendant[] = [];
  let lastStyles: InlineStyle[] = [];
  let lineCounter = 0;

  // create a new paragraph
  const lineStyle = fugue.getBlockStyle(lineCounter++);
  descendants.push(descendant(lineStyle));

  for (const node of fugue.traverseTree()) {
    if (!node.value) continue;

    // create a text node with the given styles
    const textNode: CustomText = {
      text: node.value,
    };
    node.styles.forEach(style => {
      (textNode as any)[style] = true;
    });

    // new line - create a new paragraph
    if (node.value === '\n') {
      const lineStyle = fugue.getBlockStyle(lineCounter++);
      descendants.push(descendant(lineStyle, ''));
      lastStyles = [];
      continue;
    }

    const lastDescendant = last(descendants);
    const lastTextNode = last(lastDescendant.children) as CustomText;
    if (!isEqual(lastStyles, node.styles.filter(Boolean)) || !lastTextNode) {
      // append text node with the given styles
      lastDescendant.children.push(textNode);
    } else {
      // merge text nodes with the same styles
      lastTextNode.text += textNode.text;
    }
    lastStyles = node.styles as InlineStyle[];
  }
  // if descendants has no children, add an empty text node
  if (descendants[0].children.length === 0) {
    descendants[0].children.push({ text: '' });
  }
  return descendants;
}

/**
 * Creates a descendant object.
 * @param style
 * @param children
 * @returns
 */
export const descendant = (style: BlockStyle, ...children: string[]): Descendant => ({
  type: style,
  children: children.map(text => ({ text })),
});

/**
 * Checks if the block style is a multi block.
 * @param blockStyle
 */
export const isMultiBlock = (blockStyle: BlockStyle) => {
  const multiBlocks: BlockStyle[] = [BlockStyles.li, BlockStyles.num, BlockStyles.blockquote];
  return multiBlocks.includes(blockStyle);
};

/**
 * Builds the editor with the given plugins.
 * @param plugins
 */
export const buildEditor = (...plugins: Array<(editor: Editor) => Editor>): Editor =>
  plugins.reduce((acc, plugin) => plugin(acc), createEditor());
