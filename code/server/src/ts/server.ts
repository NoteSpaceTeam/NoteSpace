import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { Services } from '@services/Services';
import cors from 'cors';
import eventsInit from '@controllers/ws/events';
import router from '@src/controllers/http/router';
import config from '@src/config';
import initSocketEvents from '@controllers/ws/initSocketEvents';
import { DocumentsService } from '@services/DocumentsService';
import { TestDatabases } from '@databases/TestDatabases';

// databases
const databases = new TestDatabases();

// services
const docService = new DocumentsService(databases.document);
const services = new Services(databases);

// server and controllers
const app = express();
const server = http.createServer(app);
const io = new Server(server, config.SERVER_OPTIONS);
const api = router(services, io);

app.use(cors({ origin: config.ORIGIN }));
app.use(express.json());
app.use('/', api);

// setup event handlers
const events = eventsInit(docService);
const socketEvents = initSocketEvents(events);
io.on('connection', socketEvents);

server.listen(config.SERVER_PORT, config.SERVER_IP, () => {
  console.log(`listening on http://${config.SERVER_IP}:${config.SERVER_PORT}`);
});
