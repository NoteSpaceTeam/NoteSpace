import { useCallback } from 'react';
import { RenderElementProps, RenderLeafProps } from 'slate-react';
import { DefaultElement, CodeElement, Leaf } from '@src/editor/slate/modules/Components.tsx';

function useRenderers() {
  const renderElement = useCallback((props: RenderElementProps) => {
    switch (props.element.type) {
      case 'code':
        return <CodeElement {...props} />;
      default:
        return <DefaultElement {...props} />;
    }
  }, []);

  const renderLeaf = useCallback((props: RenderLeafProps) => {
    return <Leaf {...props} />;
  }, []);

  return { renderElement, renderLeaf };
}

export default useRenderers;
