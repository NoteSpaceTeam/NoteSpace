import { Socket } from 'socket.io';
import { leaveRoom } from '@controllers/ws/rooms';

function leave() {
  return function (socket: Socket) {
    leaveRoom(socket);
  };
}

export default leave;
