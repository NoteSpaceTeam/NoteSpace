import { getSelection } from '@editor/slate/utils/selection';
import { Editor } from 'slate';
import { InlineStyle } from '@notespace/shared/types/styles';
import { Fugue } from '@editor/crdt/fugue';
import { InlineStyleOperation } from '@notespace/shared/crdt/types/operations';

export function formatMark(fugue: Fugue, editor: Editor, mark: InlineStyle, value: boolean): InlineStyleOperation[] {
  const selection = getSelection(editor);
  return fugue.updateInlineStyleLocal(selection, mark, value);
}
