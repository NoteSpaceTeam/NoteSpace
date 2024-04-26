import { Socket } from 'socket.io';
import { DocumentService } from '@src/types';
import { getRoomId } from '@controllers/ws/rooms';

function onTitleChange(service: DocumentService) {
  return async function (socket: Socket, title: string) {
    const documentId = getRoomId(socket);
    if (!documentId) {
      throw new Error('Document Id is required');
    }
    await service.updateTitle(documentId, title);
    socket.broadcast.to(documentId).emit('titleChange', title);
  };
}

export default onTitleChange;
