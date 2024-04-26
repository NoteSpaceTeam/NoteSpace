import { Socket } from 'socket.io';
import { joinRoom } from '@controllers/ws/rooms';

function onJoinDocument() {
  return function (socket: Socket, documentId: string) {
    joinRoom(socket, documentId);
  };
}

export default onJoinDocument;
