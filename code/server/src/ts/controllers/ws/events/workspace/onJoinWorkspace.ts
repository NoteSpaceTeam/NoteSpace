import { Socket } from 'socket.io';
import rooms from '@controllers/ws/rooms/rooms';

function onJoinWorkspace() {
  return function (socket: Socket, id: string) {
    if (!id) throw new Error('Workspace id is required');
    rooms.workspace.join(socket, id);
  };
}

export default onJoinWorkspace;
