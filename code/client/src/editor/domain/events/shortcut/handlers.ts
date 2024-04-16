import { Cursor } from '@notespace/shared/types/cursor';
import { Fugue } from '@editor/crdt/fugue';
import { Editor } from 'slate';
import { Communication } from '@socket/communication';
import { ShortcutHandlers } from '@editor/domain/events/shortcut/types';
import { formatMark } from '@editor/slate/utils/formatMark';
import { InlineStyle } from '@notespace/shared/types/styles';

export default (editor: Editor, fugue: Fugue, communication: Communication) : ShortcutHandlers => {
  function onCtrlDeletion(cursor: Cursor, reverse : boolean) {
    const operations = fugue.deleteWordByCursor(cursor, reverse);
    if (!operations) return;
    communication.emit('operation', operations);
  }

  function onFormat(mark : string, value : boolean) {
    const operations = formatMark(fugue, editor, mark as InlineStyle, value);
    communication.emitChunked('operation', operations);
  }

  return {
    onCtrlDeletion,
    onFormat
  }
}