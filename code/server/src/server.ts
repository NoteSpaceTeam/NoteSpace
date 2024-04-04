import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { config } from 'dotenv';
import cors from 'cors';
import databaseInit from '@database/memory/operations';
import serviceInit from '@services/documentService';
import eventsInit from '@controllers/websocket/events';
import router from '@src/controllers/http/router';
import onConnection from '@controllers/websocket/onConnection';

config();
const PORT = process.env.PORT || 8080;
const database = databaseInit();
const service = serviceInit(database);
const events = eventsInit(service);
const api = router(service);
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: process.env.ORIGIN },
  connectionStateRecovery: {},
});

app.use(cors({ origin: '*' }));
app.use('/', api);

io.on('connection', onConnection(service, events));

// do not start the server if this file is being imported
if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`listening on http://localhost:${PORT}`);
  });
}
export default {
  app,
  onConnection: onConnection(service, events),
};
