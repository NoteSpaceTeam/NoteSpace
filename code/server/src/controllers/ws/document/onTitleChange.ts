import { Socket } from 'socket.io';
import { DocumentService } from '@src/types';

function onTitleChange(service: DocumentService) {
  return async function (socket: Socket, title: string) {
    await service.updateTitle(title);
    socket.broadcast.emit('titleChange', title);
  };
}

export default onTitleChange;
