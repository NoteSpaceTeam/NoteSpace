import { Socket } from 'socket.io';
import { Operation } from '@notespace/shared/src/document/types/operations';

import { ForbiddenError, InvalidParameterError } from '@domain/errors/errors';
import { DocumentsService } from '@services/DocumentsService';
import rooms from '@controllers/ws/rooms/rooms';

function onOperation(service: DocumentsService) {
  return async (socket: Socket, operations: Operation[]) => {
    if (!operations) throw new InvalidParameterError('Operations are required');

    const workspaceId = rooms.workspace.get(socket)?.id;
    const documentId = rooms.document.get(socket)?.id;
    if (!documentId) throw new ForbiddenError('Client not in a room');

    socket.broadcast.to(documentId).emit('operation', operations);
    await service.updateDocument(workspaceId, documentId, operations);
    socket.emit('ack');
  };
}

export default onOperation;
