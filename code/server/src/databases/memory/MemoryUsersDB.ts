import { UsersRepository } from '@databases/types';
import { User } from '@notespace/shared/src/users/types';
import { Memory } from '@databases/memory/Memory';
import { NotFoundError } from '@src/errors';

export class MemoryUsersDB implements UsersRepository {
  async createUser(id: string, name: string, email: string): Promise<void> {
    Memory.users[id] = {
      id,
      name,
      email,
      createdAt: new Date().toISOString(),
    };
  }

  async getUser(id: string): Promise<User> {
    const user = Memory.users[id];
    if (!user) throw new NotFoundError(`User not found`);
    return user;
  }

  async deleteUser(id: string): Promise<void> {
    if (!Memory.users[id]) throw new NotFoundError(`User not found`);
    delete Memory.users[id];
  }

  async getUsers(): Promise<User[]> {
    return Object.values(Memory.users);
  }

  async getUserByEmail(email: string): Promise<User> {
    const user = Object.values(Memory.users).find(user => user.email === email);
    if (!user) throw new NotFoundError(`User not found`);
    return user;
  }
}
