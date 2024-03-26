import { Socket } from 'socket.io';

const cursorColorsMap = new Map<string, string>();

function onCursorChange() {
  return (socket: Socket, position: CursorChangeData) => {
    if (!cursorColorsMap.has(socket.id)) {
      const randomColor = 'hsl(' + Math.random() * 360 + ', 100%, 75%)';
      cursorColorsMap.set(socket.id, randomColor);
    }
    const color = cursorColorsMap.get(socket.id);
    socket.broadcast.emit('cursorChange', { position, id: socket.id, color });
  };
}

export default onCursorChange;
