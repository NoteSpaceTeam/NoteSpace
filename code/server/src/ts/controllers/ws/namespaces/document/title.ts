import { Socket } from 'socket.io';

import rooms from '@controllers/ws/rooms/rooms';
import { DocumentService } from '@services/documentService';

function title(service: DocumentService) {
  return async function (socket: Socket, title: string) {
    const { id, workspaceId } = rooms.document.get(socket);
    // TODO: update document title
    // socket.broadcast.to(id).emit('title', title);
  };
}

export default title;
