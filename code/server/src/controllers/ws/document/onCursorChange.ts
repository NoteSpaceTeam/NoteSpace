import { Socket } from 'socket.io';

const cursorColorsMap = new Map<string, string>();

function onCursorChange() {
  return (socket: Socket, range: any) => {
    if (!range) {
      deleteCursor(socket);
    } else {
      updateCursor(socket, range);
    }
  };
}

function deleteCursor(socket: Socket) {
  cursorColorsMap.delete(socket.id);
  socket.broadcast.emit('cursorChange', { id: socket.id });
}

function updateCursor(socket: Socket, range: any) {
  const color = getColor(socket);
  socket.broadcast.emit('cursorChange', { range, id: socket.id, color });
}

function getColor(socket: Socket) {
  if (!cursorColorsMap.has(socket.id)) {
    const randomColor = getRandomColor();
    cursorColorsMap.set(socket.id, randomColor);
  }
  return cursorColorsMap.get(socket.id);
}

function getRandomColor() {
  return 'hsl(' + Math.random() * 360 + ', 100%, 75%)';
}

export default onCursorChange;
