import { Fugue } from '@src/editor/crdt/fugue';
import { InsertOperation, DeleteOperation } from '@notespace/shared/crdt/types';
import { describe, it, expect, beforeEach } from 'vitest';

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
    const insertedMessages: InsertOperation<string>[] = fugue.insertLocal(0, 'a', 'b', 'c');
    expect(insertedMessages).toHaveLength(3);
    expect(fugue.toString()).toContain('abc');
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
    fugue.insertLocal(0, 'a', 'b', 'c');
    fugue.deleteLocal(1, 3);
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
