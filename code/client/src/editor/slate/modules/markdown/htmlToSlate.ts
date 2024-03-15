import { jsx } from 'slate-hyperscript';
import isHtml from 'is-html';
import { Elements } from '@src/editor/slate/modules/Elements';
import { Descendant } from 'slate';

interface ElementAttributes {
  [key: string]: unknown;
}

type ElementTagFunction = (el: Element) => ElementAttributes;

const elementTags: { [key: string]: ElementTagFunction } = {
  a: el => ({ type: 'link', url: el.getAttribute('href') }),
  blockquote: () => ({ type: Elements.blockquote }),
  h1: () => ({ type: Elements.h1 }),
  h2: () => ({ type: Elements.h2 }),
  h3: () => ({ type: Elements.h3 }),
  h4: () => ({ type: Elements.h4 }),
  h5: () => ({ type: Elements.h5 }),
  h6: () => ({ type: Elements.h6 }),
  img: el => ({
    type: Elements.img,
    url: el.getAttribute('src'),
    alt: el.getAttribute('alt'),
  }),
  li: () => ({ type: Elements.li }),
  ol: () => ({ type: Elements.ol }),
  ul: () => ({ type: Elements.ul }),
  p: () => ({ type: Elements.p }),
  code: () => ({ type: Elements.code }),
};

interface TextAttributes {
  [key: string]: boolean;
}

type TextTagFunction = () => TextAttributes;

const textTags: { [key: string]: TextTagFunction } = {
  code: () => ({ code: true }),
  del: () => ({ strikethrough: true }),
  em: () => ({ italic: true }),
  i: () => ({ italic: true }),
  s: () => ({ strikethrough: true }),
  strong: () => ({ bold: true }),
  u: () => ({ underline: true }),
};

function deserializeEach(el: Element | Node): Descendant[] {
  if (el.nodeType === 3) {
    const text = (el as Text).textContent || '';
    return [{ text }];
  } else if (el.nodeType !== 1) {
    return [];
  } else if (el.nodeName === 'br') {
    return [{ text: '\n' }];
  }

  const { nodeName } = el as Element;
  let parent = el as Element;

  if (nodeName === 'code' && parent.childNodes[0] && parent.childNodes[0].nodeName === 'code') {
    parent = parent.childNodes[0] as Element;
  }

  let children: Descendant[] = [];
  if (parent.childNodes.length) {
    children = Array.from(parent.childNodes).map(deserializeEach).flat();
  }

  if (el.nodeName === 'body') {
    return children;
  }

  if (elementTags[nodeName]) {
    const attrs = elementTags[nodeName](parent);
    return [jsx('element', attrs, children)];
  }
  if (textTags[nodeName]) {
    const attrs = textTags[nodeName]();
    return children.map(child => jsx('text', attrs, child));
  }
  return children;
}

const deserialize = (rawHtml: string): Descendant[] => {
  let html = rawHtml;
  if (!isHtml(rawHtml)) {
    html = `<p>${rawHtml}</p>`;
  }
  const document = new DOMParser().parseFromString(html, 'text/html');

  return deserializeEach(document.body);
};

export default deserialize;
