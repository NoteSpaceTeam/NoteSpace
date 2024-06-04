import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { Services } from '@services/Services';
import cors from 'cors';
import eventsInit from '@controllers/ws/events';
import router from '@src/controllers/http/router';
import config from '@src/config';
import initSocketEvents from '@controllers/ws/initSocketEvents';
import { ServerLogger } from '@src/utils/logging';
import { TestDatabases } from '@databases/TestDatabases';
import { ProductionDatabases } from '@databases/ProductionDatabases';

/**
 * Boot the server
 * Used instead of directly calling the server in order to allow for args passing
 * @param args
 */
function bootServer(args: string[]): void {
  // validate server mode
  const mode = args[0];
  if (args.length > 0 && mode !== 'dev' && mode !== 'prod') {
    ServerLogger.logError('Invalid server mode. Use "dev" or "prod"');
    process.exit(1);
  }
  // setup services and databases
  const databases = mode === 'dev' ? new TestDatabases() : new ProductionDatabases();
  const services = new Services(databases);

  ServerLogger.logWarning('Starting server in ' + `${mode} mode...`);

  // setup server and controllers
  const app = express();
  const server = http.createServer(app);
  const io = new Server(server, config.SERVER_OPTIONS);
  const api = router(services, io);

  // setup middlewares
  app.use(cors({ origin: config.ORIGIN }));
  app.use(express.json());

  // setup routes
  app.use('/', api);

  // setup event handlers
  const events = eventsInit(services.documents);
  const socketEvents = initSocketEvents(events);
  io.on('connection', socketEvents);

  server.listen(config.SERVER_PORT, config.SERVER_IP, () => {
    ServerLogger.logSuccess(`Listening on http://${config.SERVER_IP}:${config.SERVER_PORT}`);
  });
}

bootServer(process.argv.slice(2));
