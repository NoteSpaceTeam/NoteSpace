import { Cursor, Selection } from '@domain/editor/cursor';
import { InlineStyle } from '@notespace/shared/src/document/types/styles';
import { nodeInsert } from '@domain/editor/fugue/utils';
import { Operation } from '@notespace/shared/src/document/types/operations';
import { isEqual } from 'lodash';
import { BaseSelection } from 'slate';
import { Fugue } from '@domain/editor/fugue/Fugue';
import { ServiceConnector } from '@domain/editor/connectors/service/connector';
import { InputConnector } from '@domain/editor/connectors/input/types';

export default (fugue: Fugue, servicesConnector: ServiceConnector): InputConnector => {
  function insertCharacter(char: string, cursor: Cursor, styles: InlineStyle[] = []) {
    if (char.length !== 1) throw new Error('Invalid character');
    const operations = fugue.insertLocal(cursor, nodeInsert(char, styles));
    servicesConnector.emitOperations(operations);
  }

  function insertLineBreak(cursor: Cursor) {
    const operations: Operation[] = fugue.insertLocal(cursor, '\n');
    const style = cursor.column === 0 ? fugue.getBlockStyle(cursor.line) : 'paragraph'; // inherit block style when inserting line break at the beginning of a line
    if (cursor.column === 0) {
      const styleOperation = fugue.updateBlockStyleLocal(cursor.line + 1, style, true);
      operations.push(styleOperation);
    }
    servicesConnector.emitOperations(operations);
  }

  function deleteCharacter(cursor: Cursor) {
    // don't delete line if it's not a paragraph - this is to prevent deleting the block style & line simultaneously
    if (cursor.column === 0 && fugue.getBlockStyle(cursor.line) !== 'paragraph') return;
    const operations = fugue.deleteLocalByCursor(cursor);
    if (operations) {
      servicesConnector.emitOperations(operations);
    }
  }

  function deleteSelection(selection: Selection) {
    if (isEqual(selection.start, selection.end)) return;

    // if(selection.start.column === 0) selection.start.column += 1;
    // if(selection.end.column === 0) selection.end.column += 1;

    const operations = fugue.deleteLocal(selection);
    servicesConnector.emitOperations(operations);
  }

  function deleteWord(cursor: Cursor, reverse: boolean) {
    const operations = fugue.deleteWordByCursor(cursor, reverse);
    if (!operations) return;
    servicesConnector.emitOperations(operations);
  }

  function pasteText(start: Cursor, text: string) {
    const chars = text.split('');
    const lineNodes = chars.filter(char => char === '\n');
    const insertOperations: Operation[] = fugue.insertLocal(start, ...text);
    const styleOperations = lineNodes.map(() => fugue.updateBlockStyleLocal(start.line + 1, 'paragraph', true));
    servicesConnector.emitOperations([...styleOperations, ...insertOperations]);
  }

  function updateSelection(range: BaseSelection, styles: InlineStyle[]) {
    servicesConnector.emitCursorChange({ range, styles });
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
