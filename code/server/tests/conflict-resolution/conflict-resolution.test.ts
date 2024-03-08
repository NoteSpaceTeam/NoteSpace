import { Server } from 'socket.io';
import * as http from 'http';
import { io, Socket } from 'socket.io-client';
import app from '../../src/server';
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

  let lastContent = '';
  for (let i = 0; i < 10; i++) {
    test(`insert operations should be commutative (${i + 1})`, done => {
      setTimeout(() => {
        clientSocket1.emit('operation', { type: 'insert', char: 'a', index: 0 });
      }, Math.random() * 1000);
      setTimeout(() => {
        clientSocket2.emit('operation', { type: 'insert', char: 'b', index: 0 });
      }, Math.random() * 1000);
      setTimeout(async () => {
        const response = await request(app).get('/document');
        lastContent = lastContent || response.body.content;
        expect(response.body.content).toBe(lastContent);
        done();
      }, 2000);
    });
  }
});

describe('Operations must be idempotent', () => {
  beforeEach(async () => {
    const response = await request(app).delete('/document');
    expect(response.status).toBe(200);
    clientSocket1.emit('operation', { type: 'insert', char: 'a', index: 0 });
    clientSocket2.emit('operation', { type: 'insert', char: 'b', index: 1 });
    setTimeout(() => {}, 1000);
  });

  for (let i = 0; i < 5; i++) {
    test(`delete operations should be idempotent (${i + 1})`, done => {
      // both clients want to delete 'a'
      clientSocket1.emit('operation', { type: 'delete', index: 0 });
      clientSocket2.emit('operation', { type: 'delete', index: 0 });

      setTimeout(async () => {
        const response = await request(app).get('/document');
        expect(response.body.content).toBe('b');
        done();
      }, 1000);
    });
  }
});
