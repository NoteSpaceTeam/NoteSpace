import { Socket } from 'socket.io';

const rooms = new Map<string, string>();

export function joinRoom(socket: Socket, roomId: string) {
  socket.join(roomId);
  rooms.set(socket.id, roomId);
}

export function leaveRoom(socket: Socket) {
  const roomId = rooms.get(socket.id);
  if (!roomId) return;
  socket.leave(roomId);
  rooms.delete(socket.id);
}

export function getRoomId(socket: Socket) {
  return rooms.get(socket.id);
}
