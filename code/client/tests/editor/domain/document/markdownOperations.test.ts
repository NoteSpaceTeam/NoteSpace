import { describe, test, expect, beforeEach } from 'vitest';
import { Fugue } from '@domain/editor/fugue/Fugue';
import { mockCommunication } from '@tests/mocks/mockCommunication';
import { toSlate } from '@domain/editor/slate/utils/slate';
import { MarkdownConnector } from '@domain/editor/connectors/markdown/types';
import { ServiceConnector } from '@domain/editor/connectors/service/connector';
import markdownConnector from '@domain/editor/connectors/markdown/connector';
import serviceConnector from '@domain/editor/connectors/service/connector';

describe('Markdown Operations', () => {
  const communication = mockCommunication();
  let fugue: Fugue;
  let _markdownConnector: MarkdownConnector;
  let servicesConnector: ServiceConnector;

  beforeEach(() => {
    fugue = new Fugue();
    servicesConnector = serviceConnector(fugue, communication);
    _markdownConnector = markdownConnector(fugue, servicesConnector);
  });

  test('should apply block style to line', () => {
    // when
    _markdownConnector.applyBlockStyle('heading-one', 0);

    // then
    expect(toSlate(fugue)).toEqual([{ type: 'heading-one', children: [{ text: '' }] }]);
  });

  test('should apply inline style to selection', () => {
    // given
    const text = 'abc\ndef';
    const cursor = { line: 0, column: 0 };
    const selection = {
      start: {
        line: 0,
        column: 1,
      },
      end: { line: 1, column: 2 },
    };
    fugue.insertLocal(cursor, ...text.split(''));

    // when
    _markdownConnector.applyInlineStyle('bold', selection, true);

    // then
    expect(toSlate(fugue)).toEqual([
      { type: 'paragraph', children: [{ text: 'abc', bold: true }] },
      { type: 'paragraph', children: [{ text: 'de', bold: true }, { text: 'f' }] },
    ]);
  });

  test('should reset block styles by selection', () => {
    // given
    const text = 'abc\ndef';
    const cursor1 = { line: 0, column: 0 };
    const cursor2 = { line: 0, column: 1 };
    const selection1 = { start: cursor1, end: { line: 1, column: 2 } };
    const selection2 = { start: cursor2, end: { line: 1, column: 2 } };

    // when
    fugue.insertLocal(cursor1, ...text.split(''));
    _markdownConnector.applyBlockStyle('heading-one', 0);
    _markdownConnector.applyBlockStyle('list-item', 1);
    _markdownConnector.deleteBlockStyles(selection1);

    // then
    expect(toSlate(fugue)).toEqual([
      { type: 'paragraph', children: [{ text: 'abc' }] },
      { type: 'paragraph', children: [{ text: 'def' }] },
    ]);

    // when
    _markdownConnector.applyBlockStyle('heading-two', 0);
    _markdownConnector.deleteBlockStyles(selection2);

    // then
    expect(toSlate(fugue)).toEqual([
      { type: 'heading-two', children: [{ text: 'abc' }] },
      { type: 'paragraph', children: [{ text: 'def' }] },
    ]);
  });
});
