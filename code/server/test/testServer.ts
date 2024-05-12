import express = require('express');
import http = require('http');
import cors = require('cors');
import { Server } from 'socket.io';
import { DocumentsService } from '../src/ts/services/DocumentsService';
import { Services } from '../src/ts/services/Services';
import { TestDatabases } from '../src/ts/databases/TestDatabases';
import config from '../src/ts/config';
import eventsInit from '../src/ts/controllers/ws/events';
import router from '../src/ts/controllers/http/router';
import initSocketEvents from '../src/ts/controllers/ws/initSocketEvents';

function setup() {
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

  app.use(cors({ origin: '*' }));
  app.use(express.json());
  app.use('/', api);

  // Setup event handlers
  const events = eventsInit(docService);
  const socketEvents = initSocketEvents(events);

  return {
    _http: server,
    _io: io,
    _app: app,
    _socketEvents: socketEvents,
  };
}
export { setup };
