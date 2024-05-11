import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { Services } from '@services/Services';
import eventsInit from '@controllers/ws/events';
import router from '@src/controllers/http/router';
import config from '@src/config';
import { setupEventHandlers } from '@controllers/ws/setupEventHandlers';
import { Databases } from '@database/Databases';
import { DocumentService } from '@services/DocumentService';
import { MemoryDocumentDatabase } from '@database/memory/MemoryDocumentDatabase';

// databases
const docDB = new MemoryDocumentDatabase();
const databases = new Databases(docDB);

// services
const docService = new DocumentService(docDB);
const services = new Services(databases);

// server and controllers
const app = express();
const server = http.createServer(app);
const io = new Server(server, config.SERVER_OPTIONS);
const api = router(services, io);

app.use(cors({ origin: config.ORIGIN }));
app.use(express.json());
app.use('/', api);

// Setup event handlers
const events = eventsInit(docService);
setupEventHandlers(io, events);

server.listen(config.SERVER_PORT, config.SERVER_IP, () => {
  console.log(`listening on http://${config.SERVER_IP}:${config.SERVER_PORT}`);
});
