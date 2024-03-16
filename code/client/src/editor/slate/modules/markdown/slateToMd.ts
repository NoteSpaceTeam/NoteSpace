import { Text, Node } from 'slate';
import escapeHtml from 'escape-html';
import { Elements } from '@src/editor/slate/modules/Elements.ts';
import { CustomElement } from '@src/editor/slate/modules/types';

const serializeEach = (node: Node): string => {
  if (Text.isText(node)) {
    const escape = escapeHtml(node.text || '');
    if (node.bold) return `**${escape}**`;
    if (node.italic) return `*${escape}*`;
    if (node.code) return `\`${escape}\``;
    if (node.strikethrough) return `~~${escape}~~`;
    if (node.deleted) return `~~${escape}~~`;
    if (node.inserted) return `__${escape}__`;
    if (node.underline) return `__${escape}__`;
    return escape;
  }

  const children = node.children.map(n => serializeEach(n)).join('');
  switch ((node as CustomElement).type) {
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
    default:
      return children;
  }
};

const serialize = (data: Node[] = []): string => {
  return data.map(node => serializeEach(node)).join('');
};

export default serialize;
