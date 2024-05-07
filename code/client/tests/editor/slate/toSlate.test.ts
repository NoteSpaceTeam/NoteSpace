import { describe, test, expect, beforeEach } from 'vitest';
import { Fugue } from '@domain/editor/crdt/fugue';
import { Cursor, Selection } from '@notespace/shared/types/cursor';
import { Descendant } from 'slate';
import { toSlate } from '@domain/editor/slate/utils/slate';

describe('toSlate', () => {
  let fugue: Fugue;

  beforeEach(() => {
    fugue = new Fugue();
  });

  test('should return empty descendants for an empty fugue tree', () => {
    // when
    const descendants: Descendant[] = toSlate(fugue);

    // then
    expect(fugue.toString()).toEqual('');
    expect(descendants).toEqual([{ type: 'paragraph', children: [{ text: '' }] }]);
  });

  test('should return descendants based on fugue tree', () => {
    // given
    const cursor: Cursor = { line: 0, column: 0 };
    const selection: Selection = { start: cursor, end: { line: 0, column: 1 } };

    // when
    fugue.insertLocal(cursor, 'a', 'b', 'c', '\n', 'd', 'e', 'f', 'g');
    fugue.updateBlockStyleLocal(0, 'heading-one');
    fugue.updateBlockStyleLocal(1, 'list-item');
    fugue.updateInlineStyleLocal(selection, 'bold');
    const descendants: Descendant[] = toSlate(fugue);

    // then
    expect(fugue.toString()).toEqual('abc\ndefg');
    expect(descendants).toEqual([
      { type: 'heading-one', children: [{ text: 'a', bold: true }, { text: 'bc' }] },
      { type: 'list-item', children: [{ text: 'defg' }] },
    ]);
  });
});
