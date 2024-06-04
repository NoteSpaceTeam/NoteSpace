import { config } from 'dotenv';
import * as process from 'node:process';

config();

const SERVER_PORT = parseInt(process.env.PORT || '8080');
const CLIENT_PORT = parseInt(process.env.CLIENT_PORT || '5173');
const HOST_IP = process.env.HOST_IP;
const ORIGIN = [`http://localhost:${CLIENT_PORT}`, 'http://localhost:8080'];
const SERVER_IP = HOST_IP || 'localhost';

if (HOST_IP) ORIGIN.push(`http://${HOST_IP}:${CLIENT_PORT}`, `http://${HOST_IP}:8080`);

const SERVER_OPTIONS = {
  cors: { origin: ORIGIN },
  connectionStateRecovery: {},
};

export default {
  SERVER_PORT,
  CLIENT_PORT,
  ORIGIN,
  SERVER_IP,
  SERVER_OPTIONS,
};
