import { BaseSelection } from 'slate';
import { Fugue } from '@editor/crdt/fugue';
import { InputDomainOperations } from '@editor/domain/document/input/types';
import { Cursor, Selection } from '@notespace/shared/types/cursor';
import { nodeInsert } from '@editor/crdt/utils';
import { InlineStyle } from '@notespace/shared/types/styles';
import { Operation } from '@notespace/shared/crdt/types/operations';
import { Communication } from '@editor/domain/communication';

export default (fugue: Fugue, communication: Communication): InputDomainOperations => {
  function insertCharacter(char: string, cursor: Cursor, styles: InlineStyle[] = []) {
    if (char.length !== 1) throw new Error('Invalid character');
    const operations = fugue.insertLocal(cursor, nodeInsert(char, styles));
    communication.emitChunked('operation', operations);
  }

  function insertLineBreak(cursor: Cursor) {
    const operations = fugue.insertLocal(cursor, '\n');
    const styleOperation = fugue.updateBlockStyleLocal(cursor.line + 1, 'paragraph', true);
    communication.emitChunked('operation', [styleOperation, ...operations]);
  }

  function deleteCharacter(cursor: Cursor) {
    // don't delete line if it's not a paragraph
    if (cursor.column === 0 && fugue.getBlockStyle(cursor.line) !== 'paragraph') return;
    const operations = fugue.deleteLocalByCursor(cursor);
    if (operations) communication.emit('operation', operations);
  }

  function deleteSelection(selection: Selection) {
    const operations = fugue.deleteLocal(selection);
    communication.emitChunked('operation', operations);
  }

  function deleteWord(cursor: Cursor, reverse: boolean) {
    const operations = fugue.deleteWordByCursor(cursor, reverse);
    if (!operations) return;
    communication.emit('operation', operations);
  }

  function pasteText(start: Cursor, text: string) {
    const chars = text.split('');
    const lineNodes = chars.filter(char => char === '\n');
    const operations: Operation[] = fugue.insertLocal(start, ...text);
    for (let i = 0; i < lineNodes.length; i++) {
      const styleOperation = fugue.updateBlockStyleLocal(start.line + i, 'paragraph', true);
      operations.push(styleOperation);
    }
    communication.emitChunked('operation', operations);
  }

  function updateSelection(range: BaseSelection, styles: InlineStyle[]) {
    communication.emit('cursorChange', { range, styles });
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
