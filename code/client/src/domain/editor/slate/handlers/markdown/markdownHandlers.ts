import { getSelection, isSelected } from '@/domain/editor/slate/utils/selection';
import { Editor } from 'slate';
import CustomEditor from '@/domain/editor/slate/CustomEditor';
import { MarkdownDomainOperations } from '@/domain/editor/operations/markdown/types';
import { InlineStyle } from '@notespace/shared/types/styles';

export default (editor: Editor, handlers: MarkdownDomainOperations) => {
  /**
   * Handles formatting
   * @param mark
   */
  function onFormat(mark: InlineStyle) {
    const value = CustomEditor.toggleMark(editor, mark);
    if (!isSelected(editor)) return;
    const selection = getSelection(editor);
    handlers.applyInlineStyle(mark, selection, value);
  }

  return { onFormat };
};
