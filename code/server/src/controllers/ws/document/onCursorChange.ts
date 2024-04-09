import { Socket } from 'socket.io';

const cursorColorsMap = new Map<string, string>();

function onCursorChange() {
  return (socket: Socket, range: any) => {
    if (!cursorColorsMap.has(socket.id)) {
      const randomColor = 'hsl(' + Math.random() * 360 + ', 100%, 75%)';
      cursorColorsMap.set(socket.id, randomColor);
    }
    const color = cursorColorsMap.get(socket.id);
    socket.broadcast.emit('cursorChange', { range, id: socket.id, color });
  };
}

export default onCursorChange;
