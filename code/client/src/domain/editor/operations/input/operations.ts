import { BaseSelection } from 'slate';
import { Fugue } from '@domain/editor/crdt/fugue';
import { InputDomainOperations } from '@domain/editor/operations/input/types';
import { Cursor, Selection } from '@notespace/shared/src/document/types/cursor';
import { nodeInsert } from '@domain/editor/crdt/utils';
import { InlineStyle } from '@notespace/shared/src/document/types/styles';
import { Operation } from '@notespace/shared/src/document/types/operations';
import { Communication } from '@services/communication/communication';
import { isEqual } from 'lodash';

export default (fugue: Fugue, { socket }: Communication): InputDomainOperations => {
  function insertCharacter(char: string, cursor: Cursor, styles: InlineStyle[] = []) {
    if (char.length !== 1) throw new Error('Invalid character');
    const operations = fugue.insertLocal(cursor, nodeInsert(char, styles));
    socket.emit('operations', operations);
  }

  function insertLineBreak(cursor: Cursor) {
    const operations = fugue.insertLocal(cursor, '\n');
    const styleOperation = fugue.updateBlockStyleLocal(cursor.line + 1, 'paragraph', true);
    socket.emit('operations', [styleOperation, ...operations]);
  }

  function deleteCharacter(cursor: Cursor) {
    // don't delete line if it's not a paragraph - this is to prevent deleting the block style & line simultaneously
    if (cursor.column === 0 && fugue.getBlockStyle(cursor.line) !== 'paragraph') return;
    const operations = fugue.deleteLocalByCursor(cursor);
    if (operations) socket.emit('operations', operations);
  }

  function deleteSelection(selection: Selection) {
    if (isEqual(selection.start, selection.end)) return;

    if (selection.start.column === 0) selection.start.column += 1;
    if (selection.end.column === 0) selection.end.column += 1;

    const operations = fugue.deleteLocal(selection);
    socket.emit('operations', operations);
  }

  function deleteWord(cursor: Cursor, reverse: boolean) {
    const operations = fugue.deleteWordByCursor(cursor, reverse);
    if (!operations) return;
    socket.emit('operations', operations);
  }

  function pasteText(start: Cursor, text: string) {
    const chars = text.split('');
    const lineNodes = chars.filter(char => char === '\n');
    const insertOperations: Operation[] = fugue.insertLocal(start, ...text);
    const styleOperations = lineNodes.map(() => fugue.updateBlockStyleLocal(start.line + 1, 'paragraph', true));
    socket.emit('operations', [...styleOperations, ...insertOperations]);
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
