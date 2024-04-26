import { type RenderElementProps } from 'slate-react';
import { ElementRenderers, LeafRenderers } from './elements.tsx';
import { Paragraph } from './components/components.ts';
import { type CustomText } from '@src/components/editor/slate/types.ts';
import { type ReactNode } from 'react';
import Selection from '@src/components/editor/components/cursor/Selection.tsx';
import Cursor from '@src/components/editor/components/cursor/Cursor.tsx';
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
    const { color, id, range, styles } = leaf.cursor;
    if (Range.isCollapsed(range!)) {
      children = <Cursor color={color} styles={styles} key={id} children={children} />;
    } else {
      children = <Selection color={color} children={children} />;
    }
  }
  return children;
};
