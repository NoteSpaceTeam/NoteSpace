import * as express from 'express';
import { Server } from 'socket.io';
import { MemoryDocumentDatabase } from '../src/ts/database/memory/MemoryDocumentDatabase';
import { DocumentService } from '../src/ts/services/DocumentService';
import eventsInit from '../src/ts/controllers/ws/events';
import router from '../src/ts/controllers/http/router';
import { setupEventHandlers } from '../src/ts/controllers/ws/setupEventHandlers';
import { Services } from '../src/ts/services/Services';
import { Databases } from '../src/ts/database/Databases';

// Setup database
const docDB = new MemoryDocumentDatabase();
const databases = new Databases(docDB);

// Setup services
const docService = new DocumentService(docDB);
const services = new Services(databases);

const events = eventsInit(docService);
const api = router(services);
const app = express();

app.use(express.json());
app.use('/', api);

const setup = (io: Server) => setupEventHandlers(io, events);

export { app, setup };
