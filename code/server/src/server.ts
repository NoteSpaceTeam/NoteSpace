import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import databaseInit from '@database/memory/operations';
import serviceInit from '@services/documentService';
import eventsInit from '@controllers/ws/events';
import router from '@src/controllers/http/router';
import onConnection from '@controllers/ws/onConnection';
import config from './config';

const database = databaseInit();
const service = serviceInit(database);
const events = eventsInit(service);
const api = router(service);
const app = express();
const server = http.createServer(app);
const io = new Server(server, config.SERVER_OPTIONS);
const onConnectionHandler = onConnection(events);

app.use(cors({ origin: config.ORIGIN }));
app.use('/', api);

io.on('connection', onConnectionHandler);

// do not start the server if this file is being imported
if (require.main === module) {
  server.listen(config.SERVER_PORT, config.SERVER_IP, () => {
    console.log(`listening on http://${config.SERVER_IP}:${config.SERVER_PORT}`);
  });
}
export default {
  app,
  onConnectionHandler,
};
