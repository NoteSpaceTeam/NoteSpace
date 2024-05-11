import { SocketHandler } from '@controllers/ws/types';
import { Socket } from 'socket.io';

export default function initSocketEvents(events: Record<string, SocketHandler>) {
  // const onCursorChange = events['cursorChange'];
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
      // onCursorChange(socket, null); // remove cursor
      console.log('a client disconnected', reason);
    });
  };
}
