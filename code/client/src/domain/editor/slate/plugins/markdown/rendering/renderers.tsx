import { type RenderElementProps, RenderLeafProps } from 'slate-react';
import { ElementRenderers, LeafRenderers } from './elements';
import Selection from '@ui/pages/document/components/cursor/Selection';
import Cursor from '@ui/pages/document/components/cursor/Cursor';
import { Range } from 'slate';
import { type BlockStyle, BlockStyles } from '@notespace/shared/document/types/styles';
import CheckListItem from '@domain/editor/slate/plugins/markdown/rendering/components/elements/CheckListItem';
import { isStatefulBlock } from '@domain/editor/slate/utils/slate';

/**
 * Returns the renderer for a given element type
 * @param style
 * @param props
 * @param updateStyle
 */
export const getElementRenderer = (
  style: BlockStyle,
  props: RenderElementProps,
  updateStyle: (style: BlockStyle) => void
) => {
  if (isStatefulBlock(style)) return statefulElementRenderers(style, props, updateStyle);
  const key = style as keyof typeof ElementRenderers;
  const renderer = ElementRenderers[key];
  return renderer(props);
};

function statefulElementRenderers(
  style: BlockStyle,
  props: RenderElementProps,
  updateStyle: (style: BlockStyle) => void
) {
  function onToggle(active: boolean) {
    const style = active ? BlockStyles.checked : BlockStyles.unchecked;
    updateStyle(style);
  }
  if (style === BlockStyles.checked) {
    return <CheckListItem {...props} active={true} onToggle={onToggle} />;
  } else if (style === BlockStyles.unchecked) {
    return <CheckListItem {...props} active={false} onToggle={onToggle} />;
  }
  throw new Error('Invalid stateful block type');
}

/**
 * Returns the renderer for a given leaf
 * @param props
 */
export const getLeafRenderer = ({ attributes, leaf, children }: RenderLeafProps) => {
  for (const style in leaf) {
    const key = style as keyof typeof LeafRenderers;
    const renderer = LeafRenderers[key];
    if (!renderer) continue;
    children = renderer(children);
  }
  if (leaf.cursor) {
    const { color, range, styles } = leaf.cursor;
    children = Range.isCollapsed(range!) ? (
      <Cursor color={color} styles={styles} children={children} />
    ) : (
      <Selection color={color} children={children} />
    );
  }
  return <span {...attributes}>{children}</span>;
};
