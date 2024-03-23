import { Server } from 'socket.io';
import * as http from 'http';
import { io, Socket } from 'socket.io-client';
import { InsertOperation, DeleteOperation } from '@notespace/shared/crdt/types/operations';
import { Node } from '@notespace/shared/crdt/types/nodes';
import { FugueTree } from '@notespace/shared/crdt/FugueTree';
import request = require('supertest');
import { getApp, treeToString } from '../utils';
import { Express } from 'express';

const baseURL = `http://localhost:${process.env.PORT}`;
let app: Express;

let ioServer: Server;
let clientSocket1: Socket;
let clientSocket2: Socket;

beforeAll(done => {
  app = getApp();
  const httpServer = http.createServer(app);
  ioServer = new Server(httpServer);
  clientSocket1 = io(baseURL);
  clientSocket2 = io(baseURL);
  done();
});

afterAll(() => {
  ioServer.close();
  clientSocket1.close();
  clientSocket2.close();
});

describe('Operations must be commutative', () => {
  beforeEach(async () => {
    const response = await request(app).delete('/document');
    expect(response.status).toBe(200);
  });

  test('insert operations should be commutative', async () => {
    const insertMessage1: InsertOperation = {
      type: 'insert',
      id: { sender: 'A', counter: 0 },
      value: 'a',
      parent: { sender: 'root', counter: 0 },
      side: 'R',
    };
    const insertMessage2: InsertOperation = {
      type: 'insert',
      id: { sender: 'B', counter: 0 },
      value: 'b',
      parent: { sender: 'root', counter: 0 },
      side: 'R',
    };

    const responsePromises = [
      new Promise(resolve => {
        clientSocket1.emit('operation', insertMessage1, resolve);
      }),
      new Promise(resolve => {
        clientSocket2.emit('operation', insertMessage2, resolve);
      })
    ];

    await Promise.all(responsePromises);

    const response = await request(app).get('/document');
    expect(response.status).toBe(200);
    const nodes = response.body as Record<string, Node<string>[]>;
    const tree = new FugueTree<string>();
    tree.setTree(new Map(Object.entries(nodes)));
    const result = treeToString(tree);
    expect(result).toBe('ab');
  }, 10000);
});

describe('Operations must be idempotent', () => {
  beforeEach(async () => {
    const response = await request(app).delete('/document');
    expect(response.status).toBe(200);
    const insertMessage: InsertOperation = {
      type: 'insert',
      id: { sender: 'A', counter: 0 },
      value: 'a',
      parent: { sender: 'root', counter: 0 },
      side: 'R',
    };
    const insertMessage2: InsertOperation = {
      type: 'insert',
      id: { sender: 'B', counter: 0 },
      value: 'a',
      parent: { sender: 'root', counter: 0 },
      side: 'R',
    };
    // both clients insert 'a'
    clientSocket1.emit('operation', insertMessage);
    clientSocket2.emit('operation', insertMessage2);
    await new Promise(resolve => setTimeout(resolve, 100)); // Ensure inserts are processed
  });

  test('delete operations should be idempotent', async () => {
    const deleteMessage: DeleteOperation = {
      type: 'delete',
      id: { sender: 'A', counter: 0 },
    };
    // both clients want to delete the same 'a'
    clientSocket1.emit('operation', deleteMessage);
    clientSocket2.emit('operation', deleteMessage);

    await new Promise(resolve => setTimeout(resolve, 100)); // Ensure deletes are processed

    const response = await request(app).get('/document');
    const nodes = response.body as Record<string, Node<string>[]>;
    const tree = new FugueTree();
    tree.setTree(new Map(Object.entries(nodes)));
    const result = treeToString(tree);
    expect(result).toBe('a');
  });
});
