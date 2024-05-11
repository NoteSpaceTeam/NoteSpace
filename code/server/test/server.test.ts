import express = require('express');
import http = require('http');
import { Server } from 'socket.io';
import { MemoryDocumentDatabase } from '../src/ts/database/memory/MemoryDocumentDatabase';
import { DocumentService } from '../src/ts/services/DocumentService';
import eventsInit from '../src/ts/controllers/ws/events';
import router from '../src/ts/controllers/http/router';
import { setupEventHandlers } from '../src/ts/controllers/ws/setupEventHandlers';
import { Services } from '../src/ts/services/Services';
import { Databases } from '../src/ts/database/Databases';
import config from '../src/ts/config';

function setup() {
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
