/**
 * Room class
 * A room serves to isolate users from each other
 * A user can join a room and leave it
 * Users can only receive messages broadcast to the room they are in
 */
class Room {
  private readonly roomId: string;
  private users: string[] = [];

  constructor(roomId: string) {
    this.roomId = roomId;
  }

  /**
   * Add a user to the room
   * @param userId
   */
  join(userId: string) {
    this.users.push(userId);
  }

  /**
   * Remove a user from the room
   * @param userId
   */
  leave(userId: string) {
    this.users = this.users.filter(id => id !== userId);
  }

  /**
   * Check if a user is in the room
   * @param userId
   */
  has(userId: string) {
    return this.users.includes(userId);
  }

  get id() {
    return this.roomId;
  }
}

export default Room;
