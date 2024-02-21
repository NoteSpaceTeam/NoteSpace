import express from 'express';
import {Server} from 'socket.io';
import http from 'http';
import {config} from 'dotenv';

config();

const PORT = process.env.PORT || 3000;
const HOST_IP = process.env.HOST_IP || 'localhost';


const app = express();
const server = http.createServer(app);
const io = new Server(server);


app.get('/', (req, res) => {
  res.send('Hello World');
});

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(PORT, () => {
  console.log(`listening on http://${HOST_IP}:${PORT}`);
});
