class Room {
  private readonly roomId: string;
  private users: string[] = [];

  constructor(roomId: string) {
    this.roomId = roomId;
  }

  join(userId: string) {
    this.users.push(userId);
  }

  leave(userId: string) {
    this.users = this.users.filter(id => id !== userId);
  }

  has(userId: string) {
    return this.users.includes(userId);
  }

  get id() {
    return this.roomId;
  }
}

export default Room;
