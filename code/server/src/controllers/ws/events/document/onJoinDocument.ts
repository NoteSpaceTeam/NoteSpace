import { Socket } from 'socket.io';
import rooms from '@controllers/ws/rooms/rooms';
import { InvalidParameterError } from '@domain/errors/errors';
import { getUserFromSocket } from '@controllers/ws/utils';
import { getCursorColor } from '@controllers/ws/events/document/onCursorChange';

function onJoinDocument() {
  return function (socket: Socket, documentId: string) {
    if (!documentId) throw new InvalidParameterError('Document id is required');

    // get user
    const user = getUserFromSocket(socket);
    if (!user) return;

    // join the document room
    rooms.documents.join(socket, documentId, user);

    // broadcast to all clients in the document
    socket.in(documentId).emit('joinedDocument', [{ ...user, color: getCursorColor(socket.id) }]);

    // send the clients that are already in the document to the new client
    const room = rooms.documents.getRoom(documentId)!;
    const users = room
      .getClients()
      .map(client => ({
        ...client.user,
        color: getCursorColor(client.socketId),
      }))
      .filter(u => u.id !== user.id);
    socket.emit('joinedDocument', users);
  };
}

export default onJoinDocument;
