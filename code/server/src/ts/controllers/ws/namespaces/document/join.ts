import { Socket } from 'socket.io';
import { joinRoom } from '@controllers/ws/rooms';

function join() {
  return function (socket: Socket, documentId: string) {
    joinRoom(socket, documentId);
  };
}

export default join;
