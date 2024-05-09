import { Socket } from 'socket.io';
import { DocumentService } from '@services/types';
import rooms from '@controllers/ws/rooms/rooms';

function title(service: DocumentService) {
  return async function (socket: Socket, title: string) {
    const { id } = rooms.document.get(socket);
    // TODO: update workspace title
    // socket.broadcast.to(id).emit('title', title);
  };
}

export default title;
