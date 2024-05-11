import { type ReactNode } from 'react';
import { BlockStyles } from '@notespace/shared/src/document/types/styles';
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
  Link,
  ListItem,
  NumberedListItem,
  Paragraph,
} from './components/components';

export const ElementRenderers = {
  [BlockStyles.p]: (props: RenderElementProps) => <Paragraph {...props} />,
  [BlockStyles.h1]: (props: RenderElementProps) => <Heading1 {...props} />,
  [BlockStyles.h2]: (props: RenderElementProps) => <Heading2 {...props} />,
  [BlockStyles.h3]: (props: RenderElementProps) => <Heading3 {...props} />,
  [BlockStyles.h4]: (props: RenderElementProps) => <Heading4 {...props} />,
  [BlockStyles.h5]: (props: RenderElementProps) => <Heading5 {...props} />,
  [BlockStyles.h6]: (props: RenderElementProps) => <Heading6 {...props} />,
  [BlockStyles.blockquote]: (props: RenderElementProps) => <Blockquote {...props} />,
  [BlockStyles.li]: (props: RenderElementProps) => <ListItem {...props} />,
  [BlockStyles.num]: (props: RenderElementProps) => <NumberedListItem {...props} />,
  [BlockStyles.code]: (props: RenderElementProps) => <Code {...props} />,
  [BlockStyles.hr]: (props: RenderElementProps) => <LineBreak {...props} />,
  [BlockStyles.link]: (props: RenderElementProps) => <Link {...props} />,
} as const;

export const LeafRenderers = {
  bold: (children: ReactNode) => <strong>{children}</strong>,
  italic: (children: ReactNode) => <em>{children}</em>,
  underline: (children: ReactNode) => <u>{children}</u>,
  strikethrough: (children: ReactNode) => <del>{children}</del>,
  code: (children: ReactNode) => <code>{children}</code>,
} as const;
