import { Socket } from 'socket.io';
import Room from '@controllers/ws/rooms/Room';
import { UserData } from '@notespace/shared/src/users/types';

export function joinRoom(rooms: Map<string, Room>, roomId: string, socket: Socket, user: UserData) {
  socket.join(roomId);
  const room = rooms.get(roomId) || new Room(roomId);
  room.join(socket.id, user);
  rooms.set(roomId, room);
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
