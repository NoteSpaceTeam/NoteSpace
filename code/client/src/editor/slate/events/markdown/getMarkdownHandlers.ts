import { Fugue } from '@editor/crdt/fugue';
import { Communication } from '@editor/domain/communication';
import { Editor } from 'slate';
import CustomEditor from '@editor/slate/CustomEditor';
import { InlineStyle } from '@notespace/shared/types/styles';
import { formatMark } from '@editor/slate/utils/formatMark';

function getMarkdownHandlers(editor: Editor, fugue: Fugue, communication: Communication) {
  const applyMark = (mark: string) => {
    const value = CustomEditor.toggleMark(editor, mark);
    const operations = formatMark(fugue, editor, mark as InlineStyle, value);
    communication.emitChunked('operation', operations);
  };
  return { applyMark };
}

export default getMarkdownHandlers;
