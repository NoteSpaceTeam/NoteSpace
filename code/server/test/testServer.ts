import express = require('express');
import http = require('http');
import cors = require('cors');
import { Server } from 'socket.io';
import { Services } from '../src/services/Services';
import { TestDatabases } from '../src/databases/TestDatabases';
import config from '../src/config';
import eventsInit from '../src/controllers/ws/events';
import router from '../src/controllers/http/router';
import initSocketEvents from '../src/controllers/ws/initSocketEvents';

function setup() {
  // setup services and databases
  const databases = new TestDatabases();
  const services = new Services(databases);

  // setup express app
  const app = express();
  const server = http.createServer(app);
  const io = new Server(server, config.SERVER_OPTIONS);
  const api = router(services, io);

  app.use(cors({ origin: '*' }));
  app.use(express.json());
  app.use('/', api);

  // setup event handlers
  const events = eventsInit(services.documents);
  const socketEvents = initSocketEvents(events);

  return {
    _http: server,
    _io: io,
    _app: app,
    _socketEvents: socketEvents,
  };
}
export { setup };
