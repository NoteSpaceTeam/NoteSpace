import { describe, it, expect, beforeEach } from 'vitest';
import { Fugue } from '@editor/crdt/fugue';
import getInputOperations from '@editor/domain/document/input/operations';
import { InputDomainOperations } from '@editor/domain/document/input/types.ts';
import { mockCommunication } from '../mocks/mockCommunication.ts';

describe('Input Operations', () => {
  const communication = mockCommunication();
  let fugue: Fugue;
  let inputOperations: InputDomainOperations;

  beforeEach(() => {
    fugue = new Fugue();
    inputOperations = getInputOperations(fugue, communication);
  });

  it('should insert character', () => {
    // given
    const cursor = { line: 0, column: 0 };

    // when
    inputOperations.insertCharacter('a', cursor);

    // then
    expect(fugue.toString()).toEqual('a');
  });

  it('should insert line break', () => {
    // given
    const cursor = { line: 0, column: 0 };

    // when
    inputOperations.insertLineBreak(cursor);

    // then
    expect(fugue.toString()).toEqual('\n');
  });

  it('should delete character', () => {
    // given
    const cursor1 = { line: 0, column: 0 };
    const cursor2 = { line: 0, column: 1 };
    inputOperations.insertCharacter('a', cursor1);

    // when
    inputOperations.deleteCharacter(cursor2);

    // then
    expect(fugue.toString()).toEqual('');
  });

  it('should delete by selection', () => {
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

  it('should delete word', () => {
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

  it('should paste text', () => {
    // given
    const text = 'hello world\nthis is a test\n';
    const cursor = { line: 0, column: 0 };

    // when
    inputOperations.pasteText(cursor, text);

    // then
    expect(fugue.toString()).toEqual(text);
  });
});
