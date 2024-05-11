import { Socket } from 'socket.io';
import rooms from '@controllers/ws/rooms/rooms';

function onJoinDocument() {
  return function (socket: Socket, documentId: string) {
    rooms.document.join(socket, documentId);
  };
}

export default onJoinDocument;
