import { Socket } from 'socket.io';
import rooms from '@controllers/ws/rooms/rooms';

function onLeaveWorkspace() {
  return function (socket: Socket) {
    rooms.workspace.leave(socket);
  };
}

export default onLeaveWorkspace;
