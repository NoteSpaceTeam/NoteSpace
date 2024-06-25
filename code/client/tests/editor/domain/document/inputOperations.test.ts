import { describe, test, expect, beforeEach } from 'vitest';
import { Fugue } from '@domain/editor/fugue/Fugue';

import { mockCommunication } from '@tests/mocks/mockCommunication';
import { InputConnector } from '@domain/editor/connectors/input/types';
import serviceConnector, { ServiceConnector } from '@domain/editor/connectors/service/connector';
import inputConnector from '@domain/editor/connectors/input/connector';

describe('Input Operations', () => {
  const communication = mockCommunication();
  let fugue: Fugue;
  let _inputConnector: InputConnector;
  let servicesConnector: ServiceConnector;

  beforeEach(() => {
    fugue = new Fugue();
    servicesConnector = serviceConnector(fugue, communication);
    _inputConnector = inputConnector(fugue, servicesConnector);
  });

  test('should insert character', () => {
    // given
    const cursor = { line: 0, column: 0 }; // must mimic slate cursor

    // when
    _inputConnector.insertCharacter('a', cursor);

    // then
    expect(fugue.toString()).toEqual('a');
  });

  test('should insert line break', () => {
    // given
    const cursor = { line: 0, column: 0 }; // must mimic slate cursor

    // when
    _inputConnector.insertLineBreak(cursor);

    // then
    expect(fugue.toString()).toEqual('\n');
  });

  test('should delete character', () => {
    // given
    const cursor1 = { line: 0, column: 0 }; // must mimic slate cursor
    const cursor2 = { line: 0, column: 1 };
    _inputConnector.insertCharacter('a', cursor1);

    // when
    _inputConnector.deleteCharacter(cursor2);

    // then
    expect(fugue.toString()).toEqual('');
  });

  test('should delete by selection', () => {
    // given
    const cursor1 = { line: 0, column: 0 }; // must mimic slate cursor
    const cursor2 = { line: 0, column: 1 };
    const cursor3 = { line: 0, column: 2 };
    _inputConnector.insertCharacter('a', cursor1);
    _inputConnector.insertCharacter('b', cursor2);

    // when
    _inputConnector.deleteSelection({ start: cursor1, end: cursor3 });

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
      _inputConnector.insertCharacter(char, { line: 0, column: index });
    });
    _inputConnector.deleteWord(cursor1, true);

    // then
    expect(fugue.toString()).toEqual('hello ');

    // when
    _inputConnector.deleteWord(cursor2, false);

    // then
    expect(fugue.toString()).toEqual(' ');
  });

  test('should paste text', () => {
    // given
    const text = 'hello world\nthis is a test\n';
    const cursor = { line: 0, column: 0 };

    // when
    _inputConnector.pasteText(cursor, text);

    // then
    expect(fugue.toString()).toEqual(text);
  });
});
