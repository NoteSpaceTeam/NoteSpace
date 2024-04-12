import * as http from 'http';
import { io, Socket } from 'socket.io-client';
import { InsertOperation, DeleteOperation } from '@notespace/shared/crdt/types/operations';
import { Nodes } from '@notespace/shared/crdt/types/nodes';
import { FugueTree } from '@notespace/shared/crdt/FugueTree';
import request = require('supertest');
import { Server } from 'socket.io';
import server from '../../src/server';

const { app, onConnectionHandler } = server;
const PORT = process.env.PORT || 8080;
const BASE_URL = `http://localhost:${PORT}`;
let ioServer: Server;
let httpServer: http.Server;
let client1: Socket;
let client2: Socket;
const tree = new FugueTree();

beforeAll(done => {
  httpServer = http.createServer(app);
  ioServer = new Server(httpServer);

  ioServer.on('connection', onConnectionHandler);
  httpServer.listen(PORT, () => {
    client1 = io(BASE_URL);
    client2 = io(BASE_URL);
    done();
  });
});

afterAll(done => {
  ioServer.off('connection', onConnectionHandler);
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

  it('insert operations should be commutative', async () => {
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
    client1.emit('operation', [insert1]);
    client2.emit('operation', [insert2]);

    await new Promise(resolve => setTimeout(resolve, 500));
    const response = await request(app).get('/document');
    expect(response.status).toBe(200);
    const nodes = response.body.nodes as Nodes<string>;
    tree.setTree(nodes);
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
    client1.emit('operation', [insert1]);
    client2.emit('operation', [insert2]);
    await new Promise(resolve => setTimeout(resolve, 100));
  });

  it('delete operations should be idempotent', done => {
    const delete1: DeleteOperation = {
      type: 'delete',
      id: { sender: 'B', counter: 0 },
    };
    // both clients want to delete the same 'a'
    client1.emit('operation', [delete1]);
    client2.emit('operation', [delete1]);

    setTimeout(async () => {
      const response = await request(app).get('/document');
      const nodes = response.body.nodes as Nodes<string>;
      tree.setTree(nodes);
      expect(tree.toString()).toBe('a');
      done();
    }, 500);
  });
});
