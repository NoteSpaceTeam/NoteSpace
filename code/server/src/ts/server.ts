import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { NoteSpaceServices } from '@services/noteSpaceServices';
import eventsInit from '@controllers/ws/events';
import router from '@src/controllers/http/router';
import config from '@src/config';
import { setupEventHandlers } from '@controllers/ws/setupEventHandlers';
import { NoteSpaceDatabases } from '@database/noteSpaceDB';
import { DocumentService } from '@services/documentService';
import { DocumentMemoryDB } from '@database/memory/memoryDB';

// Setup database
const docDB = new DocumentMemoryDB();
const databases = new NoteSpaceDatabases(docDB);

// Setup services
const docService = new DocumentService(docDB);
const services = new NoteSpaceServices(databases);

// Setup server
const api = router(services);
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
