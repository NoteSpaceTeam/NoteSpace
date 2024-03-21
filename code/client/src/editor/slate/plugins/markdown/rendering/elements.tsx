import { Elements } from '@editor/slate/model/types.ts';
import { RenderElementProps } from 'slate-react';
import {
  Blockquote,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  LineBreak,
  ListItem,
  NumberedListItem,
} from './components/components.ts';
import { ReactNode } from 'react';

export const ElementRenderers = {
  [Elements.h1]: (props: RenderElementProps) => <Heading1 {...props} />,
  [Elements.h2]: (props: RenderElementProps) => <Heading2 {...props} />,
  [Elements.h3]: (props: RenderElementProps) => <Heading3 {...props} />,
  [Elements.h4]: (props: RenderElementProps) => <Heading4 {...props} />,
  [Elements.h5]: (props: RenderElementProps) => <Heading5 {...props} />,
  [Elements.h6]: (props: RenderElementProps) => <Heading6 {...props} />,
  [Elements.blockquote]: (props: RenderElementProps) => <Blockquote {...props} />,
  [Elements.li]: (props: RenderElementProps) => <ListItem {...props} />,
  [Elements.num]: (props: RenderElementProps) => <NumberedListItem {...props} />,
  [Elements.code]: (props: RenderElementProps) => <Code {...props} />,
  [Elements.hr]: (props: RenderElementProps) => <LineBreak {...props} />,
} as const;

export const LeafRenderers = {
  bold: (children: ReactNode) => <strong>{children}</strong>,
  italic: (children: ReactNode) => <em>{children}</em>,
  underline: (children: ReactNode) => <u>{children}</u>,
  strikethrough: (children: ReactNode) => <del>{children}</del>,
  code: (children: ReactNode) => <code>{children}</code>,
} as const;
