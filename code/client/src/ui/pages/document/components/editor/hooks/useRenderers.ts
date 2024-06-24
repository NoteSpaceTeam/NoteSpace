import { useCallback } from 'react';
import { ReactEditor, type RenderElementProps, type RenderLeafProps } from 'slate-react';
import { getElementRenderer, getLeafRenderer } from '@domain/editor/slate/plugins/markdown/rendering/renderers';
import { Editor } from 'slate';
import { Fugue } from '@domain/editor/fugue/Fugue';
import { BlockStyle } from '@notespace/shared/src/document/types/styles';
import { ServiceConnector } from '@domain/editor/connectors/service/connector';

/**
 * Returns the renderers for the editor.
 */
function useRenderers(editor: Editor, fugue?: Fugue, connector?: ServiceConnector) {
  const renderElement = useCallback(
    (props: RenderElementProps) => {
      const type = props.element.type as BlockStyle;
      const path = ReactEditor.findPath(editor, props.element);
      const line = path[path.length - 1];
      const updateBlockStyle = (style: BlockStyle) => {
        if (!fugue || !connector) return;
        const operation = fugue.updateBlockStyleLocal(line, style);
        connector.emitOperations([operation]);
      };
      return getElementRenderer(type, props, updateBlockStyle);
    },
    [connector, editor, fugue]
  );
  const renderLeaf = useCallback((props: RenderLeafProps) => getLeafRenderer(props), []);
  return { renderElement, renderLeaf };
}

export default useRenderers;
