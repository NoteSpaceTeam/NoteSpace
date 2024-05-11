import { useCallback } from 'react';
import { ReactEditor, type RenderElementProps, type RenderLeafProps } from 'slate-react';
import { getElementRenderer, getLeafRenderer } from '@domain/editor/slate/plugins/markdown/rendering/renderers';
import { Editor } from 'slate';
import { Fugue } from '@domain/editor/crdt/fugue';
import { BlockStyle } from '@notespace/shared/src/document/types/styles';
import { Communication } from '@/services/communication/communication.ts';

/**
 * Returns the renderers for the editor.
 */
function useRenderers(editor: Editor, fugue: Fugue, { socket }: Communication) {
  const renderElement = useCallback(
    (props: RenderElementProps) => {
      const type = props.element.type as BlockStyle;
      const path = ReactEditor.findPath(editor, props.element);
      const line = path[path.length - 1];
      const updateBlockStyle = (style: BlockStyle) => {
        const operation = fugue.updateBlockStyleLocal(line, style);
        socket.emit('operation', [operation]);
      };
      return getElementRenderer(type, props, updateBlockStyle);
    },
    [editor, fugue, socket]
  );
  const renderLeaf = useCallback((props: RenderLeafProps) => getLeafRenderer(props), []);
  return { renderElement, renderLeaf };
}

export default useRenderers;
