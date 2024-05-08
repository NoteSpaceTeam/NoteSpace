import { Socket } from 'socket.io';
import { leaveRoom } from '@controllers/ws/rooms';

function onLeaveDocument() {
  return function (socket: Socket) {
    leaveRoom(socket);
  };
}

export default onLeaveDocument;
