import { Socket } from 'socket.io';
import { InlineStyle } from '@notespace/shared/src/document/types/styles';
import rooms from '@controllers/ws/rooms/rooms';

type CursorData = {
  range: any;
  styles: InlineStyle[];
};

const cursorColorsMap = new Map<string, string>();

function onCursorChange() {
  return (socket: Socket, range: any) => {
    const documentId = rooms.documents.get(socket.id)?.id;
    if (!documentId) return;

    if (!range) deleteCursor(socket, documentId);
    else updateCursor(socket, range, documentId);
  };
}

export function deleteCursor(socket: Socket, documentId: string) {
  cursorColorsMap.delete(socket.id);
  socket.broadcast.to(documentId).emit('cursorChange', { id: socket.id });
}

function updateCursor(socket: Socket, data: CursorData, documentId: string) {
  const color = getCursorColor(socket.id);
  const socketData = { ...data, id: socket.id, color };

  socket.broadcast.to(documentId).emit('cursorChange', socketData);
}

export function getCursorColor(socketId: string) {
  if (!cursorColorsMap.has(socketId)) {
    const randomColor = getRandomColor();
    cursorColorsMap.set(socketId, randomColor);
  }
  return cursorColorsMap.get(socketId)!;
}

function getRandomColor(): string {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export default onCursorChange;
