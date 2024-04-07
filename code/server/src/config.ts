import { config } from 'dotenv';

config();

const PORT = process.env.PORT || 8080;
const ORIGIN = ['http://localhost:5173', `http://${process.env.HOST_IP}:5173`];
const serverOptions = {
  cors: { origin: ORIGIN },
  connectionStateRecovery: {},
};

export default {
  PORT,
  ORIGIN,
  serverOptions,
};
