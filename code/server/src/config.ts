import { config } from 'dotenv';
import * as process from 'node:process';

config();

const PORT = Number.parseInt(process.env.PORT || '') || 8080;
const ORIGIN = process.env.SERVER_IP || 'localhost';
const CLIENT_ORIGIN = ['http://localhost', `http://${process.env.CLIENT_IP}`].map(
  url => `${url}:${process.env.CLIENT_PORT}`
);
const serverOptions = {
  cors: { origin: CLIENT_ORIGIN },
  connectionStateRecovery: {},
};

export default {
  PORT,
  CLIENT_ORIGIN,
  ORIGIN,
  serverOptions,
};
