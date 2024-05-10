import { Socket } from 'socket.io';
import rooms from '@controllers/ws/rooms/rooms';

function onLeaveDocument() {
  return function (socket: Socket) {
    rooms.document.leave(socket);
  };
}

export default onLeaveDocument;
