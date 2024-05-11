import { Socket } from 'socket.io';
import rooms from '@controllers/ws/rooms/rooms';

function onJoinWorkspace() {
  return function (socket: Socket, documentId: string) {
    rooms.workspace.join(socket, documentId);
  };
}

export default onJoinWorkspace;
