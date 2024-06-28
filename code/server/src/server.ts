import express from 'express';
import http from 'http';
import cookieParser from 'cookie-parser';
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
import { authMiddleware } from '@controllers/http/middlewares/authMiddlewares';

// setup server mode
const args = process.argv.slice(2);
const mode = args[0] || 'prod';
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
app.set('trust proxy', 1); // trust first proxy for secure cookies

// setup middlewares
app.use(cors(config.SERVER_OPTIONS.cors));
app.use(cookieParser());
app.use(express.json());

// setup routes
app.use('/', api);

// setup event handlers
io.engine.use(cookieParser());
io.engine.use(authMiddleware);
const events = eventsInit(services);
const socketEvents = initSocketEvents(events);
io.on('connection', socketEvents);

server.listen(config.PORT, () => {
  ServerLogger.logSuccess(`Listening on port ${config.PORT}`);
});
