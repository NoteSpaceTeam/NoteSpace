import { Fugue } from '@editor/crdt/fugue';
import { InsertOperation, DeleteOperation } from '@notespace/shared/crdt/types';
import { Selection, Cursor } from '@editor/slate.js/model/cursor';
import { InsertNode } from '@editor/crdt/types';
import { describe, it, expect, beforeEach } from 'vitest';

const a: InsertNode = { value: 'a', styles: [] };
const b: InsertNode = { value: 'b', styles: [] };
const c: InsertNode = { value: 'c', styles: [] };

describe('Fugue', () => {
  let fugue: Fugue<string>;

  beforeEach(() => {
    fugue = new Fugue<string>();
  });

  it('should initialize properly', () => {
    expect(fugue).toBeDefined();
    expect(fugue.toString()).toEqual(expect.any(String));
  });

  it('should insert values locally', () => {
    const start: Cursor = { line: 0, column: 0 };
    fugue.insertLocal(start, a, b, c);
    expect(fugue.toString()).toEqual('abc');
  });

  it('should insert values remotely', () => {
    const message: InsertOperation<string> = {
      type: 'insert',
      id: { sender: 'A', counter: 0 },
      value: 'a',
      parent: { sender: 'root', counter: 0 },
      side: 'R',
    };
    fugue.insertRemote(message);
    expect(fugue.toString()).toContain('a');
  });

  it('should delete values locally', () => {
    const start: Cursor = { line: 0, column: 0 };
    fugue.insertLocal(start, a, b, c);
    const selection: Selection = { start: { line: 0, column: 1 }, end: { line: 0, column: 3 } };
    fugue.deleteLocal(selection);
    expect(fugue.toString()).toEqual('a');
  });

  it('should delete values remotely', () => {
    const insertMessage: InsertOperation<string> = {
      type: 'insert',
      id: { sender: 'A', counter: 0 },
      value: 'x',
      parent: { sender: 'root', counter: 0 },
      side: 'R',
    };
    fugue.insertRemote(insertMessage);
    const deleteMessage: DeleteOperation = {
      type: 'delete',
      id: { sender: 'A', counter: 0 },
    };
    fugue.deleteRemote(deleteMessage);
    expect(fugue.toString()).toEqual('');
  });
});
