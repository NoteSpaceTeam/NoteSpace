import { useCallback } from 'react';
import { type RenderElementProps, type RenderLeafProps } from 'slate-react';
import { getElementRenderer, getLeafRenderer } from '@editor/slate.js/plugins/markdown/rendering/renderers.tsx';

/**
 * Returns the renderers for the editor.
 */
function useRenderers() {
  /**
   * Renders the element.
   */
  const renderElement = useCallback((props: RenderElementProps) => getElementRenderer(props.element.type, props), []);

  /**
   * Renders the leaf.
   */
  const renderLeaf = useCallback(
    ({ attributes, children, leaf }: RenderLeafProps) => <span {...attributes}>{getLeafRenderer(leaf, children)}</span>,
    []
  );

  return { renderElement, renderLeaf };
}

export default useRenderers;
