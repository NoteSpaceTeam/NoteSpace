import * as http from 'http';
import { io, Socket } from 'socket.io-client';
import { InsertOperation, DeleteOperation, Operation } from '@notespace/shared/crdt/types/operations';
import { Nodes } from '@notespace/shared/crdt/types/nodes';
import { FugueTree } from '@notespace/shared/crdt/FugueTree';
import request = require('supertest');
import { Server } from 'socket.io';
import server from '../../src/server';
import { applyOperations } from './utils';

const { app, onConnectionHandler } = server;
const PORT = process.env.PORT || 8080;
const BASE_URL = `http://localhost:${PORT}`;
let ioServer: Server;
let httpServer: http.Server;
let client1: Socket;
let client2: Socket;
const tree = new FugueTree<string>();

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
    // create a document
    const createdResponse = await request(app).post('/documents');
    expect(createdResponse.status).toBe(201);
    const id = createdResponse.body.id;

    // clients join the document
    client1.emit('joinDocument', id);
    client2.emit('joinDocument', id);

    // client 1 inserts 'a' and client 2 inserts 'b'
    client1.emit('operation', [insert1]);
    client2.emit('operation', [insert2]);

    await new Promise(resolve => setTimeout(resolve, 500));

    // get the document
    const response = await request(app).get('/documents/' + id);
    expect(response.status).toBe(200);
    const operations = response.body.operations as Operation[];

    // apply the operations to the tree
    applyOperations(tree, operations);

    expect(tree.toString()).toBe('ab');
  });
});

describe('Operations must be idempotent', () => {
  test('delete operations should be idempotent', async () => {
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

    // create a document
    const createdResponse = await request(app).post('/documents');
    expect(createdResponse.status).toBe(201);
    const id = createdResponse.body.id;

    // clients join the document
    client1.emit('joinDocument', id);
    client2.emit('joinDocument', id);

    // both clients insert 'a'
    client1.emit('operation', [insert1]);
    client2.emit('operation', [insert2]);

    await new Promise(resolve => setTimeout(resolve, 500));

    const delete1: DeleteOperation = {
      type: 'delete',
      id: { sender: 'B', counter: 0 },
    };
    // both clients want to delete the same 'a'
    client1.emit('operation', [delete1]);
    client2.emit('operation', [delete1]);

    await new Promise(resolve => setTimeout(resolve, 500));

    const response = await request(app).get('/documents/' + id);
    const nodes = response.body.nodes as Nodes<string>;
    tree.setTree(nodes);
    expect(tree.toString()).toBe('a');
  });
});
