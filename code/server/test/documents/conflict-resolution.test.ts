import * as http from 'http';
import { Server } from 'socket.io';
import { setup } from '../server.test';
import { applyOperations } from './utils';
import { io, Socket } from 'socket.io-client';
import { InsertOperation, DeleteOperation } from '@notespace/shared/src/document/types/operations';
import { FugueTree } from '@notespace/shared/src/document/FugueTree';
import { requests as requestOperations } from '../utils/requests';
import { randomString } from '../utils';

const PORT = process.env.PORT || 8080;
const BASE_URL = `http://localhost:${PORT}/document`;
let ioServer: Server;
let httpServer: http.Server;
let requests: ReturnType<typeof requestOperations>;
let client1: Socket;
let client2: Socket;
let tree = new FugueTree<string>();

beforeAll(done => {
  const { _http, _io, _app } = setup();
  httpServer = _http;
  ioServer = _io;
  requests = requestOperations(_app);

  // ioServer.on('connection', onConnectionHandler);
  httpServer.listen(PORT, () => {
    client1 = io(BASE_URL);
    client2 = io(BASE_URL);
    done();
  });
});

afterAll(done => {
  // ioServer.off('connection', onConnectionHandler);
  ioServer.close(() => {
    client1.close();
    client2.close();
    httpServer.close();
    done();
  });
});

beforeEach(() => {
  tree = new FugueTree<string>();
});

describe('Operations must be commutative', () => {
  test('insert operations should be commutative', async () => {
    // setup document
    const wid = await requests.workspace.createWorkspace(randomString());
    const id = await requests.document.createDocument(wid);

    // clients join the document
    client1.emit('join', id);
    client2.emit('join', id);

    // create insert operations
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

    // get the document
    const document = await requests.document.getDocument(wid, id);

    // apply the operations to the tree
    applyOperations(tree, document.content);

    expect(tree.toString()).toBe('ab');
  });
});

describe('Operations must be idempotent', () => {
  test('delete operations should be idempotent', async () => {
    // setup document
    const wid = await requests.workspace.createWorkspace(randomString());
    const id = await requests.document.createDocument(wid);

    // clients join the document
    client1.emit('join', id);
    client2.emit('join', id);

    // create insert operations
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

    await new Promise(resolve => setTimeout(resolve, 500));

    const delete1: DeleteOperation = {
      type: 'delete',
      id: { sender: 'B', counter: 0 },
    };
    // both clients want to delete the same 'a'
    client1.emit('operation', [delete1]);
    client2.emit('operation', [delete1]);

    await new Promise(resolve => setTimeout(resolve, 500));

    const document = await requests.document.getDocument(wid, id);
    applyOperations(tree, document.content);
    expect(tree.toString()).toBe('a');
  });
});
