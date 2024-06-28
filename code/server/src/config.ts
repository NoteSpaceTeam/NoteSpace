import { config } from 'dotenv';
import * as process from 'node:process';
import { ServerOptions } from 'socket.io';

config();

const PORT = parseInt(process.env.PORT || '8080');
const ORIGIN = process.env.ORIGIN?.split(',') || ['http://localhost:5173'];

const SERVER_OPTIONS: Partial<ServerOptions> = {
  cors: {
    origin: ORIGIN,
    credentials: true, // allow credentials (cookies)
    allowedHeaders: ['Authorization', 'Content-Type'],
  },
  connectionStateRecovery: {}, // enable connection state recovery
};

export default {
  PORT,
  ORIGIN,
  SERVER_OPTIONS,
};
