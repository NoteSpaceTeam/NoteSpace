import { Socket } from 'socket.io';
import rooms from '@controllers/ws/rooms/rooms';

function leave() {
  return function (socket: Socket) {
    rooms.document.leave(socket);
  };
}

export default leave;
