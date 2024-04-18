import { getSelection, isSelected } from '@editor/slate/utils/selection';
import { Editor } from 'slate';
import CustomEditor from '@editor/slate/CustomEditor';
import { MarkdownDomainOperations } from '@editor/domain/document/markdown/types';
import { InlineStyle } from '@notespace/shared/types/styles';

export default (editor: Editor, handlers: MarkdownDomainOperations) => {
  /**
   * Handles formatting
   * @param mark
   */
  function onFormat(mark: InlineStyle) {
    const value = CustomEditor.toggleMark(editor, mark);
    if (isSelected(editor)) {
      const selection = getSelection(editor);
      handlers.applyInlineStyle(mark, selection, value);
    }
  }

  return { onFormat };
};
