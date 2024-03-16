import { Server } from 'socket.io';
import * as http from 'http';
import { io, Socket } from 'socket.io-client';
import { InsertMessage, DeleteMessage } from './types';
import app from '../../src/server';
import { Node } from 'shared/crdt/types';
import { FugueTree } from 'shared/crdt/fugueTree';
import request = require('supertest');

const baseURL = `http://localhost:${process.env.PORT}`;
const httpServer = http.createServer(app);

let ioServer: Server;
let clientSocket1: Socket;
let clientSocket2: Socket;

beforeAll(done => {
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

  for (let i = 0; i < 10; i++) {
    test(`insert operations should be commutative (${i + 1})`, done => {
      const insertMessage1: InsertMessage<string> = {
        type: 'insert',
        id: { sender: 'A', counter: 0 },
        value: 'a',
        parent: { sender: '', counter: 0 },
        side: 'R',
      };
      const insertMessage2: InsertMessage<string> = {
        type: 'insert',
        id: { sender: 'B', counter: 0 },
        value: 'b',
        parent: { sender: '', counter: 0 },
        side: 'R',
      };
      setTimeout(() => {
        clientSocket1.emit('operation', insertMessage1);
      }, Math.random() * 1000);
      setTimeout(() => {
        clientSocket2.emit('operation', insertMessage2);
      }, Math.random() * 1000);
      setTimeout(async () => {
        const response = await request(app).get('/document');
        const nodes = response.body as Record<string, Node<string>[]>;
        const tree = new FugueTree();
        tree.setTree(new Map(Object.entries(nodes)));
        expect(tree.toString()).toBe('ab');
        done();
      }, 2000);
    });
  }
});

describe('Operations must be idempotent', () => {
  beforeEach(async () => {
    const response = await request(app).delete('/document');
    expect(response.status).toBe(200);
    const insertMessage: InsertMessage<string> = {
      type: 'insert',
      id: { sender: 'A', counter: 0 },
      value: 'a',
      parent: { sender: '', counter: 0 },
      side: 'R',
    };
    const insertMessage2: InsertMessage<string> = {
      type: 'insert',
      id: { sender: 'B', counter: 0 },
      value: 'a',
      parent: { sender: '', counter: 0 },
      side: 'R',
    };
    clientSocket1.emit('operation', insertMessage);
    clientSocket2.emit('operation', insertMessage2);
    setTimeout(() => {}, 1000);
  });

  for (let i = 0; i < 5; i++) {
    test(`delete operations should be idempotent (${i + 1})`, done => {
      const deleteMessage: DeleteMessage = {
        type: 'delete',
        id: { sender: 'A', counter: 0 },
      };
      // both clients want to delete 'a'
      clientSocket1.emit('operation', deleteMessage);
      clientSocket2.emit('operation', deleteMessage);

      setTimeout(async () => {
        const response = await request(app).get('/document');
        const nodes = response.body as Record<string, Node<string>[]>;
        const tree = new FugueTree();
        tree.setTree(new Map(Object.entries(nodes)));
        expect(tree.toString()).toBe('a');
        done();
      }, 1000);
    });
  }
});
