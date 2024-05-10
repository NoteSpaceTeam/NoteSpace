import express from 'express';
import { Server } from 'socket.io';
import { DocumentMemoryDB } from '../src/ts/database/memory/memoryDB';
import { DocumentService } from '../src/ts/services/documentService';
import eventsInit from '../src/ts/controllers/ws/events';
import router from '../src/ts/controllers/http/router';
import { setupEventHandlers } from '../src/ts/controllers/ws/setupEventHandlers';
import { NoteSpaceServices } from '../src/ts/services/noteSpaceServices';
import { NoteSpaceDatabases } from '../src/ts/database/noteSpaceDB';

// Setup database
const docDB = new DocumentMemoryDB();
const databases = new NoteSpaceDatabases(docDB);

// Setup services
const docService = new DocumentService(docDB);
const services = new NoteSpaceServices(databases);

const events = eventsInit(docService);
const api = router(services);
const app = express();

app.use(express.json());
app.use('/', api);

const setup = (io: Server) => setupEventHandlers(io, events);

export { app, setup };
