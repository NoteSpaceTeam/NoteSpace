import { Socket } from 'socket.io';
import { SocketHandler } from '@src/types';

/**
 * Returns a connection handler for socket.io
 * @param events
 */
function onConnection(events: Record<string, SocketHandler>) {
  const onCursorChange = events['cursorChange'];
  return async (socket: Socket) => {
    console.log('a client connected');

    Object.entries(events).forEach(([event, handler]) => {
      socket.on(event, async data => {
        try {
          console.log(event);
          await handler(socket, data);
        } catch (e) {
          console.error(e);
        }
      });
    });

    socket.on('disconnect', reason => {
      onCursorChange(socket, null); // remove cursor
      console.log('a client disconnected', reason);
    });
  };
}

export default onConnection;
