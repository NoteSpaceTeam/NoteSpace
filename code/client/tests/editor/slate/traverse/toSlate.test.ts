import { describe, it, expect, beforeEach } from 'vitest';
import { Fugue } from '@editor/crdt/fugue';
import { Cursor, Selection } from '@notespace/shared/types/cursor';
import { toSlate } from '@editor/slate/utils/slate';
import { Descendant } from 'slate';

describe('toSlate', () => {
  let fugue: Fugue;

  beforeEach(() => {
    fugue = new Fugue();
  });

  it('should return empty descendants for an empty fugue tree', () => {
    // when
    const descendants: Descendant[] = toSlate(fugue);

    // then
    expect(fugue.toString()).toEqual('');
    expect(descendants).toEqual([{ type: 'paragraph', children: [{ text: '' }] }]);
  });

  it('should return descendants based on fugue tree', () => {
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
      { type: 'heading-one', children: [{ text: 'ab', bold: true }, { text: 'c' }] },
      { type: 'list-item', children: [{ text: 'defg' }] },
    ]);
  });
});
