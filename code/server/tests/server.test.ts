import express from 'express';
// import cors from 'cors';
// import config from 'dotenv';
import { Server } from 'socket.io';
import databaseInit from '../src/ts/database/memory/memoryDB';
import serviceInit from '../src/ts/services/documentService';
import eventsInit from '../src/ts/controllers/ws/events';
import router from '../src/ts/controllers/http/router';
import { setupEventHandlers } from '../src/ts/controllers/ws/setupEventHandlers';

const database = databaseInit();
const service = serviceInit(database);
const events = eventsInit(service);
const api = router(service);
const app = express();

// app.use(cors({ origin: config.ORIGIN }));
app.use(express.json());
app.use('/', api);

const setup = (io: Server) => setupEventHandlers(io, events);

export { app, setup };
