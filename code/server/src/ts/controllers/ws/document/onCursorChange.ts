import { Socket } from 'socket.io';
import { InlineStyle } from '@notespace/shared/types/styles';
import { getRoomId } from '@controllers/ws/rooms';

type CursorData = {
  range: any;
  styles: InlineStyle[];
};

const cursorColorsMap = new Map<string, string>();

function onCursorChange() {
  return (socket: Socket, range: any) => {
    const documentId = getRoomId(socket);
    if (!documentId) return;

    if (!range) {
      deleteCursor(socket, documentId);
    } else {
      updateCursor(socket, range, documentId);
    }
  };
}

function deleteCursor(socket: Socket, documentId: string) {
  cursorColorsMap.delete(socket.id);
  socket.broadcast.to(documentId).emit('cursorChange', { id: socket.id });
}

function updateCursor(socket: Socket, data: CursorData, documentId: string) {
  const color = getColor(socket);
  socket.broadcast.to(documentId).emit('cursorChange', { ...data, id: socket.id, color });
}

function getColor(socket: Socket) {
  if (!cursorColorsMap.has(socket.id)) {
    const randomColor = getRandomColor();
    cursorColorsMap.set(socket.id, randomColor);
  }
  return cursorColorsMap.get(socket.id);
}

function getRandomColor() {
  return 'hsl(' + Math.random() * 360 + ', 100%, 80%)';
}

export default onCursorChange;
