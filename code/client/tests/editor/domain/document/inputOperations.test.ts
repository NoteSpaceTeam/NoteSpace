import { describe, test, expect, beforeEach } from 'vitest';
import { Fugue } from '@domain/editor/fugue/Fugue';
import getInputOperations from '@domain/editor/operations/input/operations';
import { InputDomainOperations } from '@domain/editor/operations/input/types';
import { mockCommunication } from '@tests/mocks/mockCommunication';

describe('Input Operations', () => {
  const communication = mockCommunication();
  let fugue: Fugue;
  let inputOperations: InputDomainOperations;

  beforeEach(() => {
    fugue = new Fugue();
    inputOperations = getInputOperations(fugue, communication);
  });

  test('should insert character', () => {
    // given
    const cursor = { line: 0, column: 0 };

    // when
    inputOperations.insertCharacter('a', cursor);

    // then
    expect(fugue.toString()).toEqual('a');
  });

  test('should insert line break', () => {
    // given
    const cursor = { line: 0, column: 0 };

    // when
    inputOperations.insertLineBreak(cursor);

    // then
    expect(fugue.toString()).toEqual('\n');
  });

  test('should delete character', () => {
    // given
    const cursor1 = { line: 0, column: 0 };
    const cursor2 = { line: 0, column: 1 };
    inputOperations.insertCharacter('a', cursor1);

    // when
    inputOperations.deleteCharacter(cursor2);

    // then
    expect(fugue.toString()).toEqual('');
  });

  test('should delete by selection', () => {
    // given
    const cursor1 = { line: 0, column: 0 };
    const cursor2 = { line: 0, column: 1 };
    const cursor3 = { line: 0, column: 2 };
    inputOperations.insertCharacter('a', cursor1);
    inputOperations.insertCharacter('b', cursor2);

    // when
    inputOperations.deleteSelection({ start: cursor1, end: cursor3 });

    // then
    expect(fugue.toString()).toEqual('');
  });

  test('should delete word', () => {
    // given
    const text = 'hello world';
    const cursor1 = { line: 0, column: text.length };
    const cursor2 = { line: 0, column: 0 };

    // when
    text.split('').forEach((char, index) => {
      inputOperations.insertCharacter(char, { line: 0, column: index });
    });
    inputOperations.deleteWord(cursor1, true);

    // then
    expect(fugue.toString()).toEqual('hello ');

    // when
    inputOperations.deleteWord(cursor2, false);

    // then
    expect(fugue.toString()).toEqual(' ');
  });

  test('should paste text', () => {
    // given
    const text = 'hello world\nthis is a test\n';
    const cursor = { line: 0, column: 0 };

    // when
    inputOperations.pasteText(cursor, text);

    // then
    expect(fugue.toString()).toEqual(text);
  });
});
