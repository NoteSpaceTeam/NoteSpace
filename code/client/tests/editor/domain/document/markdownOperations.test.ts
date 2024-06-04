import { describe, test, expect, beforeEach } from 'vitest';
import { Fugue } from '@domain/editor/fugue/Fugue';
import getMarkdownOperations from '@domain/editor/fugue/operations/markdown/operations';
import { mockCommunication } from '@tests/mocks/mockCommunication';
import { MarkdownDomainOperations } from '@domain/editor/fugue/operations/markdown/types';
import { toSlate } from '@domain/editor/slate/utils/slate';

describe('Markdown Operations', () => {
  const communication = mockCommunication();
  let fugue: Fugue;
  let markdownOperations: MarkdownDomainOperations;

  beforeEach(() => {
    fugue = new Fugue();
    markdownOperations = getMarkdownOperations(fugue, communication);
  });

  test('should apply block style to line', () => {
    // when
    markdownOperations.applyBlockStyle('heading-one', 0);

    // then
    expect(toSlate(fugue)).toEqual([{ type: 'heading-one', children: [{ text: '' }] }]);
  });

  test('should apply inline style to selection', () => {
    // given
    const text = 'abc\ndef';
    const cursor = { line: 0, column: 0 };
    const selection = { start: cursor, end: { line: 1, column: 2 } };
    fugue.insertLocal(cursor, ...text.split(''));

    // when
    markdownOperations.applyInlineStyle('bold', selection, true);

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
    markdownOperations.applyBlockStyle('heading-one', 0);
    markdownOperations.applyBlockStyle('list-item', 1);
    markdownOperations.deleteBlockStyles(selection1);

    // then
    expect(toSlate(fugue)).toEqual([
      { type: 'paragraph', children: [{ text: 'abc' }] },
      { type: 'paragraph', children: [{ text: 'def' }] },
    ]);

    // when
    markdownOperations.applyBlockStyle('heading-two', 0);
    markdownOperations.deleteBlockStyles(selection2);

    // then
    expect(toSlate(fugue)).toEqual([
      { type: 'heading-two', children: [{ text: 'abc' }] },
      { type: 'paragraph', children: [{ text: 'def' }] },
    ]);
  });
});
