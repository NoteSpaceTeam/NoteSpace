import { Socket } from 'socket.io';
import rooms from '@controllers/ws/rooms/rooms';
import { InvalidParameterError } from '@src/errors';
import { getUserFromSocket } from '@controllers/ws/utils';
import { getCursorColor } from '@controllers/ws/events/document/onCursorChange';
import { Collaborator } from '@notespace/shared/src/users/types';

function onJoinDocument() {
  return function (socket: Socket, documentId: string) {
    if (!documentId) throw new InvalidParameterError('Document id is required');

    // get user
    const user = getUserFromSocket(socket);
    if (!user) return;

    // join the document room
    rooms.documents.join(socket, documentId, user);

    // broadcast to all clients in the document
    const collaborator: Collaborator = { ...user, color: getCursorColor(socket.id), socketId: socket.id };
    socket.in(documentId).emit('joinedDocument', [collaborator]);

    // send the clients that are already in the document to the new client
    const room = rooms.documents.getRoom(documentId)!;
    const collaborators: Collaborator[] = room
      .getClients()
      .map(client => ({
        ...client.user,
        color: getCursorColor(client.socketId),
        socketId: client.socketId,
      }))
      .filter(u => u.id !== user.id);
    socket.emit('joinedDocument', collaborators);
  };
}

export default onJoinDocument;
