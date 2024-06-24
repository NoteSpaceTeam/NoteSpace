import { config } from 'dotenv';
import * as process from 'node:process';

config();

const SERVER_PORT = parseInt(process.env.PORT || '8080');
const CLIENT_PORT = parseInt(process.env.CLIENT_PORT || '5173');
const ORIGIN = ['http://localhost:5173'];

const SERVER_OPTIONS = {
  cors: {
    origin: ORIGIN,
    credentials: true, // allow credentials (cookies, authorization headers, etc.)
    allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Authorization', 'Content-Type'],
  },
  connectionStateRecovery: {},
};

export default {
  SERVER_PORT,
  CLIENT_PORT,
  ORIGIN,
  SERVER_OPTIONS,
};
