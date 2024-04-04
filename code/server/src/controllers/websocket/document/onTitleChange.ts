import { Socket } from 'socket.io';
import { DocumentService } from '@src/types';

function onTitleChange(service: DocumentService) {
  return function (socket: Socket, title: string) {
    service.updateTitle(title);
    socket.broadcast.emit('titleChange', title);
  };
}

export default onTitleChange;
