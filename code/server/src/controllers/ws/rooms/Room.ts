import { UserData } from '@notespace/shared/src/users/types';

type Client = {
  socketId: string;
  user: UserData;
};

/**
 * Room class
 * A room serves to isolate clients from each other
 * A client can join a room and leave it
 * Clients can only receive messages broadcast to the room they are in
 */
class Room {
  private readonly roomId: string;
  private clients: Client[] = [];

  constructor(roomId: string) {
    this.roomId = roomId;
  }

  /**
   * Add a client to the room
   * @param socketId
   * @param user
   */
  join(socketId: string, user: UserData) {
    this.clients.push({ socketId, user });
  }

  /**
   * Remove a client from the room
   * @param socketId
   */
  leave(socketId: string) {
    this.clients = this.clients.filter(u => u.socketId !== socketId);
  }

  /**
   * Check if a client is in the room
   * @param socketId
   */
  has(socketId: string) {
    return this.clients.some(u => u.socketId === socketId);
  }

  /**
   * Get the clients in the room
   */
  getClients() {
    return this.clients;
  }

  get id() {
    return this.roomId;
  }
}

export default Room;
