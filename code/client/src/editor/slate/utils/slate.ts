import { createEditor, Descendant, Editor } from 'slate';
import type { BlockStyle, InlineStyle } from '@notespace/shared/types/styles';
import type { CustomText } from '@editor/slate/model/types';
import { isEqual, last } from 'lodash';
import { Fugue } from '@editor/crdt/fugue';
import { BlockStyles } from '@notespace/shared/types/styles';

/**
 * Converts the FugueTree to a Slate document.
 */
export function fugueToSlate(): Descendant[] {
  const fugue = Fugue.getInstance();
  const root = fugue.getRootNode();
  const descendants: Descendant[] = [];
  let lastStyles: InlineStyle[] = [];
  let lineCounter = 0;

  // create a new paragraph
  const lineStyle = (root.styles[lineCounter++] as BlockStyle) || 'paragraph';
  descendants.push(descendant(lineStyle, ''));

  for (const node of fugue.traverseTree()) {
    if (!node.value) continue;
    // create a text node with the given styles
    const textNode: CustomText = {
      text: node.value as string,
      bold: node.styles.includes('bold'),
      italic: node.styles.includes('italic'),
      underline: node.styles.includes('underline'),
      strikethrough: node.styles.includes('strikethrough'),
      code: node.styles.includes('code'),
    };
    // new line
    if (node.value === '\n') {
      const lineStyle = (root.styles[lineCounter++] as BlockStyle) || 'paragraph';
      descendants.push(descendant(lineStyle, ''));
      lastStyles = node.styles as InlineStyle[];
      continue;
    }
    const lastDescendant = last(descendants);
    if (!isEqual(lastStyles, node.styles)) lastDescendant.children.push(textNode);
    else {
      const lastTextNode = last(lastDescendant.children) as CustomText;
      lastTextNode.text += textNode.text;
    }
    lastStyles = node.styles as InlineStyle[];
  }
  return descendants;
}

/**
 * Creates a descendant object.
 * @param type
 * @param children
 * @returns
 */
export const descendant = (type: BlockStyle, ...children: string[]): Descendant => ({
  type,
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
