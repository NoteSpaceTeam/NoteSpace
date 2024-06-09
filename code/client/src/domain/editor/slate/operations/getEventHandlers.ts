import { type Editor } from 'slate';
import inputHandlers from '@domain/editor/slate/operations/input';
import markdownHandlers from '@domain/editor/slate/operations/markdown';
import { InputConnector } from '@domain/editor/connectors/input/types';
import { MarkdownConnector } from '@domain/editor/connectors/markdown/types';

/**
 * Handles input events
 * @param editor
 * @param inputConnector
 * @param markdownConnector
 */
function getEventHandlers(editor: Editor, inputConnector: InputConnector, markdownConnector: MarkdownConnector) {
  // event handlers
  const { onFormat } = markdownHandlers(editor, markdownConnector);
  const { onInput, onCut, onPaste, onSelectionChange, onBlur, onShortcut } = inputHandlers(
    editor,
    inputConnector,
    onFormat
  );

  // return event handlers
  return { onInput, onCut, onPaste, onSelectionChange, onBlur, onShortcut, onFormat };
}

export default getEventHandlers;
