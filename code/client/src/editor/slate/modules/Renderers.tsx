import { useCallback } from 'react';
import { RenderElementProps, RenderLeafProps } from 'slate-react';
import { Elements } from '@src/editor/slate/modules/Elements.ts';
import Heading1 from '@src/editor/slate/modules/components/Heading1.tsx';
import Blockquote from '@src/editor/slate/modules/components/Blockquote.tsx';
import ListItem from '@src/editor/slate/modules/components/ListItem.tsx';
import Heading2 from '@src/editor/slate/modules/components/Heading2.tsx';
import Heading3 from '@src/editor/slate/modules/components/Heading3.tsx';
import Heading4 from '@src/editor/slate/modules/components/Heading4.tsx';
import Heading5 from '@src/editor/slate/modules/components/Heading5.tsx';
import Heading6 from '@src/editor/slate/modules/components/Heading6.tsx';
import Paragraph from '@src/editor/slate/modules/components/Paragraph.tsx';

function useRenderers() {
  const renderElement = useCallback((props: RenderElementProps) => {
    switch (props.element.type) {
      case Elements.blockquote:
        return <Blockquote {...props} />;
      case Elements.li:
        return <ListItem {...props} />;
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
