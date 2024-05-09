import { Socket } from 'socket.io';
import Room from '@controllers/ws/rooms/Room';

export type RoomOperations = Map<string, Room>;

export function joinRoom(rooms: RoomOperations, socket: Socket, roomId: string) {
  socket.join(roomId);
  const room = rooms.get(roomId) || new Room(roomId);
  room.join(socket.id);
  rooms.set(roomId, room);
}

export function leaveRoom(rooms: RoomOperations, socket: Socket) {
  const room = getRoom(rooms, socket);
  if (!room) return;
  socket.leave(room.id);
  room.leave(socket.id);
}

export function getRoom(rooms: RoomOperations, socket: Socket): Room | null {
  for (const room of rooms.values()) {
    if (room.has(socket.id)) return room;
  }
  return null;
}
