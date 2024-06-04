import { Socket } from 'socket.io';
import Room from '@controllers/ws/rooms/Room';

export function joinRoom(rooms: Map<string, Room>, socket: Socket, id: string) {
  socket.join(id);
  const room = rooms.get(id) || new Room(id);
  room.join(socket.id);
  rooms.set(id, room);
}

export function leaveRoom(rooms: Map<string, Room>, socket: Socket) {
  const room = getRoom(rooms, socket.id);
  if (!room) return;
  socket.leave(room.id);
  room.leave(socket.id);
}

export function getRoom(rooms: Map<string, Room>, socketId: string): Room | null {
  for (const room of rooms.values()) {
    if (room.has(socketId)) return room;
  }
  return null;
}
