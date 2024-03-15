export const Elements = {
  a: 'link',
  blockquote: 'block-quote',
  h1: 'heading-one',
  h2: 'heading-two',
  h3: 'heading-three',
  h4: 'heading-four',
  h5: 'heading-five',
  h6: 'heading-six',
  img: 'image',
  li: 'list-item',
  ol: 'numbered-list',
  p: 'paragraph',
  pre: 'code',
  ul: 'bulleted-list',
  br: 'horizontal-rule',
} as const;

export type ElementType = (typeof Elements)[keyof typeof Elements];
