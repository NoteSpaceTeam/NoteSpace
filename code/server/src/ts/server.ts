import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { Services } from '@services/Services';
import cors from 'cors';
import eventsInit from '@controllers/ws/events';
import router from '@src/controllers/http/router';
import config from '@src/config';
import initSocketEvents from '@controllers/ws/initSocketEvents';
import { TestDatabases } from '@databases/TestDatabases';
import { ServerLogCaller } from '@src/utils/logging';

const logger = ServerLogCaller;
logger.logWarning('Starting server...');

// setup services and databases
const databases = new TestDatabases();
const services = new Services(databases);

// setup server and controllers
const app = express();
const server = http.createServer(app);
const io = new Server(server, config.SERVER_OPTIONS);
const api = router(services, io);

// setup middleware
app.use(cors({ origin: config.ORIGIN }));
app.use(express.json());
app.use('/', api);

// setup event handlers
const events = eventsInit(services.documents);
const socketEvents = initSocketEvents(events);
io.on('connection', socketEvents);

server.listen(config.SERVER_PORT, config.SERVER_IP, () => {
  logger.logSuccess(`Listening on http://${config.SERVER_IP}:${config.SERVER_PORT}`);
});
