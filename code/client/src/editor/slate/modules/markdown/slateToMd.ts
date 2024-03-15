import { Text, Node } from 'slate';
import escapeHtml from 'escape-html';
import { Elements } from '@src/editor/slate/modules/Elements.ts';
import { CustomElement } from '@src/editor/slate/modules/types.ts';

const serializeEach = (node: Node): string => {
  if (Text.isText(node)) {
    const { bold, italic, underline, code, strikethrough, deleted, inserted, text } = node;
    const escape = escapeHtml(text || '');
    if (bold) return `**${escape}**`;
    if (italic) return `*${escape}*`;
    if (code) return `\`${escape}\``;
    if (strikethrough) return `~~${escape}~~`;
    if (deleted) return `~~${escape}~~`;
    if (inserted) return `__${escape}__`;
    if (underline) return `__${escape}__`;
    return escape;
  }

  const children = node.children.map(n => serializeEach(n)).join('');
  switch ((node as CustomElement).type) {
    default:
      return children;
    case Elements.p:
      return `\n${children}\n`;
    case Elements.blockquote:
      return `> ${children}\n`;
    case Elements.ul:
      return children;
    case Elements.li:
      return `* ${children}\n`;
    case Elements.h1:
      return `# ${children}`;
    case Elements.h2:
      return `## ${children}`;
    case Elements.h3:
      return `### ${children}`;
    case Elements.h4:
      return `#### ${children}`;
    case Elements.h5:
      return `##### ${children}`;
    case Elements.h6:
      return `###### ${children}`;
    case Elements.br:
      return `---`;
  }
};

const serialize = (data: Node[] = []): string => {
  return data.map(node => serializeEach(node)).join('');
};

export default serialize;
