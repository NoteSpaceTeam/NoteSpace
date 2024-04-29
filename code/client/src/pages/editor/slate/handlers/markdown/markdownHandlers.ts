import { getSelection, isSelected } from '@pages/editor/slate/utils/selection.ts';
import { Editor } from 'slate';
import CustomEditor from '@pages/editor/slate/CustomEditor.ts';
import { MarkdownDomainOperations } from '@pages/editor/domain/document/markdown/types.ts';
import { InlineStyle } from '@notespace/shared/types/styles.ts';

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
