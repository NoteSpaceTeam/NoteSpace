import { SocketNamespaces } from '@controllers/ws/types';
import { Server } from 'socket.io';

export function setupEventHandlers(io: Server, events: SocketNamespaces) {
  Object.entries(events).forEach(([namespace, event]) => {
    Object.entries(event).forEach(([name, handler]) => {
      io.of(namespace).on('connection', socket => {
        socket.on(name, async data => {
          try {
            console.log(name);
            await handler(socket, data);
          } catch (e) {
            console.error(e);
          }
        });
        if (namespace === '/document') {
          socket.on('disconnect', reason => {
            // const { cursor } = events['/document'];
            // cursor(socket, null); // remove cursor
            console.log('disconnected from document', reason);
          });
        }
      });
    });
  });
}
