import { BaseSelection } from 'slate';
import { Fugue } from '@src/components/editor/crdt/fugue.ts';
import { InputDomainOperations } from '@src/components/editor/domain/document/input/types.ts';
import { Cursor, Selection } from '@notespace/shared/types/cursor.ts';
import { nodeInsert } from '@src/components/editor/crdt/utils.ts';
import { InlineStyle } from '@notespace/shared/types/styles.ts';
import { Operation } from '@notespace/shared/crdt/types/operations.ts';
import { Communication } from '@src/communication/communication.ts';

export default (fugue: Fugue, { socket }: Communication): InputDomainOperations => {
  function insertCharacter(char: string, cursor: Cursor, styles: InlineStyle[] = []) {
    if (char.length !== 1) throw new Error('Invalid character');
    const operations = fugue.insertLocal(cursor, nodeInsert(char, styles));
    socket.emitChunked('operation', operations);
  }

  function insertLineBreak(cursor: Cursor) {
    const operations = fugue.insertLocal(cursor, '\n');
    const styleOperation = fugue.updateBlockStyleLocal(cursor.line + 1, 'paragraph', true);
    socket.emitChunked('operation', [styleOperation, ...operations]);
  }

  function deleteCharacter(cursor: Cursor) {
    // don't delete line if it's not a paragraph
    if (cursor.column === 0 && fugue.getBlockStyle(cursor.line) !== 'paragraph') return;
    const operations = fugue.deleteLocalByCursor(cursor);
    if (operations) socket.emit('operation', operations);
  }

  function deleteSelection(selection: Selection) {
    const operations = fugue.deleteLocal(selection);
    socket.emitChunked('operation', operations);
  }

  function deleteWord(cursor: Cursor, reverse: boolean) {
    const operations = fugue.deleteWordByCursor(cursor, reverse);
    if (!operations) return;
    socket.emit('operation', operations);
  }

  function pasteText(start: Cursor, text: string) {
    const chars = text.split('');
    const lineNodes = chars.filter(char => char === '\n');
    const operations: Operation[] = fugue.insertLocal(start, ...text);
    for (let i = 0; i < lineNodes.length; i++) {
      const styleOperation = fugue.updateBlockStyleLocal(start.line + i, 'paragraph', true);
      operations.push(styleOperation);
    }
    socket.emitChunked('operation', operations);
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