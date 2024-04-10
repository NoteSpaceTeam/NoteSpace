import { useCallback } from 'react';
import { type RenderElementProps, type RenderLeafProps } from 'slate-react';
import { getElementRenderer, getLeafRenderer } from '@editor/slate/plugins/markdown/rendering/renderers';

/**
 * Returns the renderers for the editor.
 */
function useRenderers() {
  const renderElement = useCallback((props: RenderElementProps) => getElementRenderer(props.element.type, props), []);

  const renderLeaf = useCallback (
    ({ attributes, children, leaf }: RenderLeafProps) => <span {...attributes}>{getLeafRenderer(leaf, children)}</span>,
    []
  );

  return { getElementRenderer: renderElement, getLeafRenderer: renderLeaf };
}

export default useRenderers;
