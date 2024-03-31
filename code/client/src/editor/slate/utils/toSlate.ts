import type { Descendant } from 'slate';
import type { BlockStyle, InlineStyle } from '@notespace/shared/types/styles.ts';
import type { CustomText } from '@editor/slate/model/types.ts';
import { isEqual } from 'lodash';
import { createChildren, createDescendant } from '@editor/slate/model/utils.ts';
import { Fugue } from '@editor/crdt/fugue.ts';

export function toSlate(): Descendant[] {
  const fugue = Fugue.getInstance();
  const root = fugue.getRootNode();
  const descendants: Descendant[] = [];
  let lastStyles: InlineStyle[] = [];
  let lineCounter = 0;

  // create a new paragraph
  const lineStyle = (root.styles[lineCounter++] as BlockStyle) || 'paragraph';
  descendants.push(createDescendant(lineStyle, createChildren('')));

  for (const node of fugue.traverseTree()) {
    const textNode: CustomText = {
      text: node.value as string,
      bold: node.styles.includes('bold'),
      italic: node.styles.includes('italic'),
      underline: node.styles.includes('underline'),
      strikethrough: node.styles.includes('strikethrough'),
      code: node.styles.includes('code'),
    };
    // if new line, add a new paragraph
    if (node.value === '\n') {
      const children = createChildren('');
      const lineStyle = (root.styles[lineCounter++] as BlockStyle) || 'paragraph';
      descendants.push(createDescendant(lineStyle, children));
      lastStyles = node.styles as InlineStyle[];
      continue;
    }
    const lastDescendant = descendants[descendants.length - 1];
    // if node styles are the same as the previous one, append the text to it
    if (isEqual(lastStyles, node.styles)) {
      const lastTextNode = lastDescendant.children[lastDescendant.children.length - 1];
      lastTextNode.text += textNode.text;
    }
    // otherwise, create a new block
    else {
      lastDescendant.children.push(textNode);
    }
    lastStyles = node.styles as InlineStyle[];
  }
  return descendants;
}
