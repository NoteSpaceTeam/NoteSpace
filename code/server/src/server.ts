import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { config } from 'dotenv';
import cors from 'cors';
import eventsInit from './ws/events';
import servicesInit from './services/services';
import dataMem from './database/dataMem';
import router from './http/router';

config();
const PORT = process.env.PORT || 8080;
const services = servicesInit(dataMem);
const api = router(services);
const events = eventsInit(dataMem);
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' },
  connectionStateRecovery: {},
});

app.use(cors({ origin: '*' }));
app.use('/', api);

io.on('connection', socket => {
  console.log('a client connected');

  if (socket.connected) {
    socket.emit('document', dataMem.getDocument());
  }

  Object.entries(events).forEach(([event, handler]) => {
    socket.on(event, data => {
      try {
        // console.log(event, data);
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
