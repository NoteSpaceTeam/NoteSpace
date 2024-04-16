import { type RenderElementProps } from 'slate-react';
import { ElementRenderers, LeafRenderers } from './elements';
import { Paragraph } from './components/components';
import { type CustomText } from '@editor/slate/types';
import { type ReactNode } from 'react';
import Cursor from '@editor/components/cursors/Cursor';
import { Range } from 'slate';

/**
 * Returns the renderer for a given element type
 * @param type
 * @param props
 */
export const getElementRenderer = (type: string, props: RenderElementProps) => {
  for (const key in ElementRenderers) {
    if (key === type) {
      const k = key as keyof typeof ElementRenderers;
      return ElementRenderers[k](props);
    }
  }
  return <Paragraph {...props} children={props.children} />;
};

/**
 * Returns the renderer for a given leaf
 * @param leaf
 * @param children
 */
export const getLeafRenderer = (leaf: CustomText, children: ReactNode) => {
  for (const key in leaf) {
    if (!leaf[key as keyof CustomText]) continue;
    const renderer = LeafRenderers[key as keyof typeof LeafRenderers];
    if (!renderer) continue;
    children = renderer(children);
  }
  if (leaf.cursor) {
    const { color, id, range } = leaf.cursor;
    if (!Range.isCollapsed(range!)) {
      children = <span style={{ backgroundColor: color }}>{children}</span>;
    }
    children = <Cursor children={children} color={color} key={id} />;
  }
  return children;
};
