import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { config } from 'dotenv';
import cors from 'cors';
import eventsInit from './api/events';
import servicesInit from './services/services';
import dataMem from './database/dataMem';
import router from './api/router';

config();

const PORT = process.env.PORT || 8080;
const services = servicesInit(dataMem);
const api = router(services);
const events = eventsInit(dataMem);
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: process.env.ORIGIN } });

app.use(cors({ origin: process.env.ORIGIN }));
app.use('/', api);

io.on('connection', socket => {
  console.log('a client connected');
  Object.entries(events).forEach(([event, handler]) => {
    socket.on(event, data => {
      try {
        console.log(event);
        handler(socket, data);
      } catch (e) {
        socket.emit('error');
        console.error(e);
      }
    });
  });
});

server.listen(PORT, () => {
  console.log(`listening on http://localhost:${PORT}`);
});

export default app;
