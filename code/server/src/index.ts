import express from 'express';
import {Server} from 'socket.io';
import http from 'http';
import {config} from 'dotenv';
import events from './socket/events'

config();

const PORT = process.env.PORT || 8080;
const app = express();
const server = http.createServer(app)
const io = new Server(server, {cors: {origin: 'http://localhost:5173'}});

app.get('/', (req, res) => {
  res.send('Hello World');
});

io.on('connection', (socket) => {
  console.log('a client connected');
  Object.entries(events).forEach(([event, handler]) => {
    socket.on(event, (data) => {
      try {
        console.log(event)
        handler(socket, data)
      } catch (e) {
        socket.emit('error')
        console.error(e)
      }
    })
  })
})

server.listen(PORT, () => {
  console.log(`listening on http://localhost:${PORT}`);
})
