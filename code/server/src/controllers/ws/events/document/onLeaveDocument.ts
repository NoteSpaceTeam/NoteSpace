import { Socket } from 'socket.io';
import rooms from '@controllers/ws/rooms/rooms';
import { deleteCursor } from '@controllers/ws/events/document/onCursorChange';
import { getUserFromSocket } from '@controllers/ws/utils';

function onLeaveDocument() {
  return function (socket: Socket) {
    const documentId = rooms.document.get(socket.id)?.id;
    if (!documentId) return;

    // leave the document room
    rooms.document.leave(socket);

    // delete cursor
    deleteCursor(socket, documentId);

    // broadcast to all clients in the document
    const user = getUserFromSocket(socket);
    if (!user) return;
    socket.in(documentId).emit('leftDocument', user.id);
  };
}

export default onLeaveDocument;
