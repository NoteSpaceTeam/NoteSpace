import type { Descendant } from 'slate';
import type { Style } from '@notespace/shared/crdt/styles.ts';
import type { CustomText } from '@editor/slate/model/types.ts';
import { isEmpty, isEqual } from 'lodash';
import { createChildren, createDescendant } from '@editor/slate/model/utils.ts';
import { Node } from '@notespace/shared/crdt/types.ts';


export function toSlate<T>(traverse : () => IterableIterator<Node<T>>): Descendant[] {
  const descendants: Descendant[] = [];
  let lastStyles: Style[] = [];
  for (const node of traverse()) {
    if (node.isDeleted) continue;
    const textNode: CustomText = {
      text: node.value as string,
      bold: node.styles.includes('bold'),
      italic: node.styles.includes('italic'),
      underline: node.styles.includes('underline'),
      strikethrough: node.styles.includes('strikethrough'),
      code: node.styles.includes('code'),
    };
    // If there are no descendants or new line, add a new paragraph
    if (isEmpty(descendants) || node.value === '\n') {
      const children = node.value === '\n' ? createChildren('') : [textNode];
      descendants.push(createDescendant('paragraph', children));
      lastStyles = node.styles;
      continue;
    }
    const lastDescendant = descendants[descendants.length - 1];
    // If node styles are the same as the previous one, append the text to it
    if (isEqual(lastStyles, node.styles)) {
      const lastTextNode = lastDescendant.children[lastDescendant.children.length - 1];
      lastTextNode.text += textNode.text;
    }
    // Otherwise, create a new block
    else {
      lastDescendant.children.push(textNode);
    }
    lastStyles = node.styles;
  }
  // If there are no descendants, add an empty paragraph
  if (isEmpty(descendants)) {
    descendants.push(createDescendant('paragraph', createChildren('')));
  }
  return descendants;
}