import express = require('express');
import http = require('http');
import { Server } from 'socket.io';
import { DocumentsService } from '../src/ts/services/DocumentsService';
import eventsInit from '../src/ts/controllers/ws/events';
import router from '../src/ts/controllers/http/router';
import { setupEventHandlers } from '../src/ts/controllers/ws/setupEventHandlers';
import { Services } from '../src/ts/services/Services';
import { MemoryDB } from '../src/ts/databases/resources/memory/MemoryDB';
import config from '../src/ts/config';
import { MemoryDocumentsDB } from '../src/ts/databases/documents/MemoryDocumentsDB';

function setup() {
  // databases
  const docDB = new MemoryDocumentsDB();
  const databases = new MemoryDB(docDB);

  // services
  const docService = new DocumentsService(docDB);
  const services = new Services(databases);

  // server and controllers
  const app = express();
  const server = http.createServer(app);
  const io = new Server(server, config.SERVER_OPTIONS);
  const api = router(services, io);

  app.use(express.json());
  app.use('/', api);

  // Setup event handlers
  const events = eventsInit(docService);
  setupEventHandlers(io, events);

  return {
    _http: server,
    _io: io,
    _app: app,
  };
}
export { setup };
