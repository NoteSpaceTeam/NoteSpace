import { Socket } from 'socket.io';
import rooms from '@controllers/ws/rooms/rooms';
import { InvalidParameterError } from '@domain/errors/errors';

function onJoinWorkspace() {
  return function (socket: Socket, id: string) {
    if (!id) throw new InvalidParameterError('Workspace id is required');
    rooms.workspace.join(socket, id);
  };
}

export default onJoinWorkspace;
