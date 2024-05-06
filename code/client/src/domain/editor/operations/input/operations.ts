import { BaseSelection } from 'slate';
import { Fugue } from '@/domain/editor/crdt/fugue';
import { InputDomainOperations } from '@/domain/editor/operations/input/types';
import { Cursor, Selection } from '@notespace/shared/types/cursor';
import { nodeInsert } from '@/domain/editor/crdt/utils';
import { InlineStyle } from '@notespace/shared/types/styles';
import { Operation } from '@notespace/shared/crdt/types/operations';
import { Communication } from '@/domain/communication/communication';

export default (fugue: Fugue, { socket }: Communication): InputDomainOperations => {
  function insertCharacter(char: string, cursor: Cursor, styles: InlineStyle[] = []) {
    if (char.length !== 1) throw new Error('Invalid character');
    const operations = fugue.insertLocal(cursor, nodeInsert(char, styles));
    socket.emit('operation', operations);
  }

  function insertLineBreak(cursor: Cursor) {
    const operations = fugue.insertLocal(cursor, '\n');
    const styleOperation = fugue.updateBlockStyleLocal(cursor.line + 1, 'paragraph', true);
    socket.emit('operation', [styleOperation, ...operations]);
  }

  function deleteCharacter(cursor: Cursor) {
    // don't delete line if it's not a paragraph
    if (cursor.column === 0 && fugue.getBlockStyle(cursor.line) !== 'paragraph') return;
    const operations = fugue.deleteLocalByCursor(cursor);
    if (operations) socket.emit('operation', operations);
  }

  function deleteSelection(selection: Selection) {
    const operations = fugue.deleteLocal(selection);
    socket.emit('operation', operations);
  }

  function deleteWord(cursor: Cursor, reverse: boolean) {
    const operations = fugue.deleteWordByCursor(cursor, reverse);
    if (!operations) return;
    socket.emit('operation', operations);
  }

  function pasteText(start: Cursor, text: string) {
    const chars = text.split('');
    const lineNodes = chars.filter(char => char === '\n');
    const insertOperations: Operation[] = fugue.insertLocal(start, ...text);
    const styleOperations = lineNodes.map(() => fugue.updateBlockStyleLocal(start.line + 1, 'paragraph', true));
    socket.emit('operation', [...styleOperations, ...insertOperations]);
  }

  function updateSelection(range: BaseSelection, styles: InlineStyle[]) {
    socket.emit('cursorChange', { range, styles });
  }

  return {
    insertCharacter,
    insertLineBreak,
    deleteCharacter,
    deleteSelection,
    deleteWord,
    pasteText,
    updateSelection,
  };
};