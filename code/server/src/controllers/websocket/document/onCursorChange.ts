import { Socket } from 'socket.io';
import { Selection } from '@notespace/shared/types/cursor';

const cursorColorsMap = new Map<string, string>();

function onCursorChange() {
  return (socket: Socket, selection: Selection) => {
    if (!cursorColorsMap.has(socket.id)) {
      const randomColor = 'hsl(' + Math.random() * 360 + ', 100%, 75%)';
      cursorColorsMap.set(socket.id, randomColor);
    }
    const color = cursorColorsMap.get(socket.id);
    socket.broadcast.emit('cursorChange', { selection, id: socket.id, color });
  };
}

export default onCursorChange;
