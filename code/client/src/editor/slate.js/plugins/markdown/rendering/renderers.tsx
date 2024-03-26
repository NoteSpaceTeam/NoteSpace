import { type RenderElementProps } from 'slate-react';
import { ElementRenderers, LeafRenderers } from './elements.tsx';
import { Paragraph } from './components/components.ts';
import { type CustomText } from '@editor/slate/model/types.ts';
import { type ReactNode } from 'react';

export const getElementRenderer = (type: string, props: RenderElementProps) => {
  for (const key in ElementRenderers) {
    if (key === type) {
      const k = key as keyof typeof ElementRenderers;
      return ElementRenderers[k](props);
    }
  }
  return <Paragraph {...props} />;
};

export const getLeafRenderer = (leaf: CustomText, children: ReactNode) => {
  for (const key in leaf) {
    if (!leaf[key as keyof CustomText]) continue;
    const renderer = LeafRenderers[key as keyof typeof LeafRenderers];
    if (!renderer) continue;
    children = renderer(children);
  }
  return children;
};
