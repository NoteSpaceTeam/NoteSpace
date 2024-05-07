import { useCallback } from 'react';
import { ReactEditor, type RenderElementProps, type RenderLeafProps } from 'slate-react';
import { getElementRenderer, getLeafRenderer } from '@domain/editor/slate/plugins/markdown/rendering/renderers';
import { Editor } from 'slate';
import { Fugue } from '@domain/editor/crdt/fugue';
import { BlockStyle } from '@notespace/shared/types/styles';

/**
 * Returns the renderers for the editor.
 */
function useRenderers(editor: Editor, fugue: Fugue) {
  const renderElement = useCallback(
    (props: RenderElementProps) => {
      const type = props.element.type as BlockStyle;
      const path = ReactEditor.findPath(editor, props.element);
      const line = path[path.length - 1];
      const updateBlockStyle = (style: BlockStyle) => fugue.updateBlockStyleLocal(line, style);
      return getElementRenderer(type, props, updateBlockStyle);
    },
    [editor, fugue]
  );
  const renderLeaf = useCallback((props: RenderLeafProps) => getLeafRenderer(props), []);
  return { renderElement, renderLeaf };
}

export default useRenderers;
