import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { config } from 'dotenv';
import cors from 'cors';
import eventsInit from './ws/events';
import servicesInit from './services/services';
import database from './database/firestore';
import router from './http/router';
import 'tsconfig-paths/register';

config();
const PORT = process.env.PORT || 8080;
const services = servicesInit(database);
const api = router(services);
const events = eventsInit(database);
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: process.env.ORIGIN },
  connectionStateRecovery: {},
});

app.use(cors({ origin: '*' }));
app.use('/', api);

io.on('connection', async socket => {
  console.log('a client connected');

  if (socket.connected) {
    const tree = await services.getTree();
    socket.emit('document', tree);
  }

  Object.entries(events).forEach(([event, handler]) => {
    socket.on(event, data => {
      try {
        console.log(event, data);
        handler(socket, data);
      } catch (e) {
        socket.emit('error');
        console.error(e);
      }
    });
  });

  socket.on('disconnect', reason => {
    console.log('a client disconnected', reason);
  });
});

server.listen(PORT, () => {
  console.log(`listening on http://localhost:${PORT}`);
});

export default app;
