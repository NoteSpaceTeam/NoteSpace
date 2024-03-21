export const BlockStyles = {
  p: "paragraph",
  h1: "heading-one",
  h2: "heading-two",
  h3: "heading-three",
  h4: "heading-four",
  h5: "heading-five",
  h6: "heading-six",
  blockquote: "block-quote",
  li: "list-item",
  num: "numbered-list-item",
  code: "code",
  hr: "horizontal-rule",
} as const;

export const InlineStyles = {
  bold: "bold",
  italic: "italic",
  underline: "underline",
  strikethrough: "strikethrough",
  code: "inline-code",
  a: "link",
} as const;

export type BlockType = (typeof BlockStyles)[keyof typeof BlockStyles];
export type InlineType = (typeof InlineStyles)[keyof typeof InlineStyles];
export type Style = BlockType | InlineType;
