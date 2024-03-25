import * as http from 'http';
import { io, Socket } from 'socket.io-client';
import { InsertOperation, DeleteOperation } from '@notespace/shared/crdt/types/operations';
import { Node } from '@notespace/shared/crdt/types/nodes';
import { FugueTree } from '@notespace/shared/crdt/FugueTree';
import request = require('supertest');
import { Server } from 'socket.io';
import server from '../../src/server';

const { app, onConnection } = server;
const PORT = process.env.PORT || 8080;
const BASE_URL = `http://localhost:${PORT}`;
let ioServer: Server;
let httpServer: http.Server;
let client1: Socket;
let client2: Socket;

beforeAll(done => {
  httpServer = http.createServer(app);
  ioServer = new Server(httpServer);

  ioServer.on('connection', onConnection);
  httpServer.listen(PORT, () => {
    client1 = io(BASE_URL);
    client2 = io(BASE_URL);
    done();
  });
});

afterAll(done => {
  ioServer.off('connection', onConnection);
  ioServer.close(() => {
    client1.close();
    client2.close();
    httpServer.close();
    done();
  });
});

describe('Operations must be commutative', () => {
  beforeEach(async () => {
    const response = await request(app).delete('/document');
    expect(response.status).toBe(200);
  });

  test('insert operations should be commutative', async () => {
    const insert1: InsertOperation = {
      type: 'insert',
      id: { sender: 'A', counter: 0 },
      value: 'a',
      parent: { sender: 'root', counter: 0 },
      side: 'R',
    };
    const insert2: InsertOperation = {
      type: 'insert',
      id: { sender: 'B', counter: 0 },
      value: 'b',
      parent: { sender: 'root', counter: 0 },
      side: 'R',
    };
    // client 1 inserts 'a' and client 2 inserts 'b'
    client1.emit('operation', insert1);
    client2.emit('operation', insert2);

    await new Promise(resolve => setTimeout(resolve, 500));
    const response = await request(app).get('/document');
    expect(response.status).toBe(200);
    const nodes = response.body as Record<string, Node<string>[]>;
    const tree = new FugueTree<string>();
    tree.setTree(new Map(Object.entries(nodes)));
    expect(tree.toString()).toBe('ab');
  });
});

describe('Operations must be idempotent', () => {
  beforeEach(async () => {
    const response = await request(app).delete('/document');
    expect(response.status).toBe(200);
    const insert1: InsertOperation = {
      type: 'insert',
      id: { sender: 'A', counter: 0 },
      value: 'a',
      parent: { sender: 'root', counter: 0 },
      side: 'R',
    };
    const insert2: InsertOperation = {
      type: 'insert',
      id: { sender: 'B', counter: 0 },
      value: 'a',
      parent: { sender: 'root', counter: 0 },
      side: 'R',
    };
    // both clients insert 'a'
    client1.emit('operation', insert1);
    client2.emit('operation', insert2);
    await new Promise(resolve => setTimeout(resolve, 100));
  });

  test('delete operations should be idempotent', done => {
    const delete1: DeleteOperation = {
      type: 'delete',
      id: { sender: 'B', counter: 0 },
    };
    // both clients want to delete the same 'a'
    client1.emit('operation', delete1);
    client2.emit('operation', delete1);

    setTimeout(async () => {
      const response = await request(app).get('/document');
      const nodes = response.body as Record<string, Node<string>[]>;
      const tree = new FugueTree();
      tree.setTree(new Map(Object.entries(nodes)));
      expect(tree.toString()).toBe('a');
      done();
    }, 500);
  });
});