import { createEditor, Descendant, Editor, Element } from 'slate';
import type { BlockStyle, InlineStyle } from '@notespace/shared/src/document/types/styles';
import type { CustomText } from '@domain/editor/slate/types';
import { isEqual, last } from 'lodash';
import { BlockStyles } from '@notespace/shared/src/document/types/styles';
import { Fugue } from '@domain/editor/fugue/Fugue';

const multiBlocks: BlockStyle[] = [
  BlockStyles.li,
  BlockStyles.num,
  BlockStyles.blockquote,
  BlockStyles.checked,
  BlockStyles.unchecked,
];
const statefulBlocks: BlockStyle[] = [BlockStyles.checked, BlockStyles.unchecked];

export function toSlate(fugue: Fugue): Descendant[] {
  const descendants: Element[] = [];
  let lastStyles: InlineStyle[] = [];
  let lineCounter = 0;

  // create a new paragraph
  const lineStyle = fugue.getBlockStyle(lineCounter++);
  descendants.push(descendant(lineStyle, ''));

  for (const node of fugue.traverseTree()) {
    if (node.parent === null || !node.value) continue;

    // create a text node with the given styles
    const textNode: CustomText = {
      text: node.value as string,
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

    const lastDescendant = last(descendants) as Element;
    const lastTextNode = last(lastDescendant.children) as CustomText;
    const nodeStyles = node.styles.filter(Boolean);
    if (!isEqual(lastStyles, nodeStyles) && lastTextNode.text) {
      // append text node with the given styles
      lastDescendant.children.push(textNode);
    } else {
      // merge text nodes with the same styles
      if (!lastTextNode.text) {
        lastDescendant.children.pop();
        lastDescendant.children.push(textNode);
      } else {
        lastTextNode.text += textNode.text;
      }
    }
    lastStyles = nodeStyles as InlineStyle[];
  }
  return descendants;
}

/**
 * Creates a descendant object.
 * @param style
 * @param children
 * @returns
 */
export const descendant = (style: BlockStyle, ...children: string[]): Element => ({
  type: style,
  children: children.map(text => ({ text })),
});

/**
 * Checks if the block style is a multi block.
 * @param blockStyle
 */
export const isMultiBlock = (blockStyle: BlockStyle) => {
  return multiBlocks.includes(blockStyle);
};

/**
 * Checks if the block style is a stateful block.
 * @param blockStyle
 */
export const isStatefulBlock = (blockStyle: BlockStyle) => {
  return statefulBlocks.includes(blockStyle);
};

/**
 * Builds the editor with the given plugins.
 * @param plugins
 */
export const buildEditor = (...plugins: Array<(editor: Editor) => Editor>): Editor =>
  plugins.reduce((acc, plugin) => plugin(acc), createEditor());
