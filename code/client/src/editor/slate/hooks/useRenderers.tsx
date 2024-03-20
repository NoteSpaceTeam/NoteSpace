import { useCallback } from 'react';
import { RenderElementProps, RenderLeafProps } from 'slate-react';
import { Elements } from '@src/editor/slate/model/types.ts';
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
  Paragraph,
} from '@src/editor/slate/markdown/components/components.ts';

function useRenderers() {
  const renderElement = useCallback((props: RenderElementProps) => {
    switch (props.element.type) {
      case Elements.h1:
        return <Heading1 {...props} />;
      case Elements.h2:
        return <Heading2 {...props} />;
      case Elements.h3:
        return <Heading3 {...props} />;
      case Elements.h4:
        return <Heading4 {...props} />;
      case Elements.h5:
        return <Heading5 {...props} />;
      case Elements.h6:
        return <Heading6 {...props} />;
      case Elements.blockquote:
        return <Blockquote {...props} />;
      case Elements.li:
        return <ListItem {...props} />;
      case Elements.num:
        return <NumberedListItem {...props} />;
      case Elements.hr:
        return <LineBreak {...props} />;
      case Elements.code:
        return <Code {...props} />;
      default:
        return <Paragraph {...props} />;
    }
  }, []);

  const renderLeaf = useCallback(({ attributes, children, leaf }: RenderLeafProps) => {
    if (leaf.bold) {
      children = <strong>{children}</strong>;
    }
    if (leaf.code) {
      children = <code>{children}</code>;
    }
    if (leaf.italic) {
      children = <em>{children}</em>;
    }
    if (leaf.underline) {
      children = <u>{children}</u>;
    }
    if (leaf.strikethrough) {
      children = <del>{children}</del>;
    }
    return <span {...attributes}>{children}</span>;
  }, []);

  return { renderElement, renderLeaf };
}

export default useRenderers;
