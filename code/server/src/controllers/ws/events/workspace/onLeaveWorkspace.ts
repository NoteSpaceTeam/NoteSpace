import { Socket } from 'socket.io';
import rooms from '@controllers/ws/rooms/rooms';
import onLeaveDocument from '@controllers/ws/events/document/onLeaveDocument';

function onLeaveWorkspace() {
  return function (socket: Socket) {
    // check if the user is in a document room
    const isInDocument = rooms.documents.isInRoom(socket.id);
    if (isInDocument) onLeaveDocument()(socket);

    // leave the workspace room
    rooms.workspaces.leave(socket);
  };
}

export default onLeaveWorkspace;
