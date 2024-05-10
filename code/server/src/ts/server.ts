import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import databaseInit from '@database/memory/memoryDB';
import {NoteSpaceServices} from '@services/noteSpaceServices';
import eventsInit from '@controllers/ws/events';
import router from '@src/controllers/http/router';
import config from '@src/config';
import { setupEventHandlers } from '@controllers/ws/setupEventHandlers';
import { NoteSpaceDB } from '@database/pg/noteSpaceDB';
import { DocumentService } from '@services/documentService';

// Setup database
const docDB = databaseInit();
const database = new NoteSpaceDB(docDB);

// Setup services
const docService = new DocumentService(docDB);
const service = new NoteSpaceServices(database);

// Setup server
const api = router(service);
const app = express();
const server = http.createServer(app);
const io = new Server(server, config.SERVER_OPTIONS);

app.use(cors({ origin: config.ORIGIN }));
app.use(express.json());
app.use('/', api);

// Setup event handlers
const events = eventsInit(docService);
setupEventHandlers(io, events);

server.listen(config.SERVER_PORT, config.SERVER_IP, () => {
  console.log(`listening on http://${config.SERVER_IP}:${config.SERVER_PORT}`);
});
