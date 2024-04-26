import { describe, it, expect, beforeEach } from 'vitest';
import { Fugue } from '@editor/crdt/fugue';
import getMarkdownOperations from '@editor/domain/document/markdown/operations';
import { mockCommunication } from '../mocks/mockCommunication.ts';
import { MarkdownDomainOperations } from '@editor/domain/document/markdown/types.ts';
import { toSlate } from '@editor/slate/utils/slate.ts';

describe('Markdown Operations', () => {
  const communication = mockCommunication();
  let fugue: Fugue;
  let markdownOperations: MarkdownDomainOperations;

  beforeEach(() => {
    fugue = new Fugue();
    markdownOperations = getMarkdownOperations(fugue, communication);
  });

  it('should apply block style to line', () => {
    // when
    markdownOperations.applyBlockStyle('heading-one', 0);

    // then
    expect(toSlate(fugue)).toEqual([{ type: 'heading-one', children: [{ text: '' }] }]);
  });

  it('should apply inline style to selection', () => {
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

  it('should reset block styles by selection', () => {
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
