import { getSelection, isSelected } from '@domain/editor/slate/utils/selection';
import { Editor } from 'slate';
import CustomEditor from '@domain/editor/slate/CustomEditor';
import { InlineStyle } from '@notespace/shared/src/document/types/styles';
import { MarkdownConnector } from '@domain/editor/connectors/markdown/types';

export default (editor: Editor, connector: MarkdownConnector) => {
  /**
   * Handles formatting
   * @param mark
   */
  function onFormat(mark: InlineStyle) {
    const value = CustomEditor.toggleMark(editor, mark);
    if (!isSelected(editor)) return;
    const selection = getSelection(editor);
    connector.applyInlineStyle(mark, selection, value);
  }

  return { onFormat };
};
