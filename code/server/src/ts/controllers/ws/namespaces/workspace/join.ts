import { Socket } from 'socket.io';
import rooms from '@controllers/ws/rooms/rooms';

function join() {
  return function (socket: Socket, documentId: string) {
    rooms.workspace.join(socket, documentId);
  };
}

export default join;
