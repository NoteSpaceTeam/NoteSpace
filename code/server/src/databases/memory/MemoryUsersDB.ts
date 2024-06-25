import { UsersRepository } from '@databases/types';
import { User, UserData } from '@notespace/shared/src/users/types';
import { Memory } from '@databases/memory/Memory';
import { NotFoundError } from '@domain/errors/errors';

export class MemoryUsersDB implements UsersRepository {
  async createUser(id: string, data: UserData): Promise<void> {
    Memory.users[id] = {
      id,
      createdAt: new Date().toISOString(),
      ...data,
    };
  }

  async getUser(id: string): Promise<User> {
    const user = Memory.users[id];
    if (!user) throw new NotFoundError(`User not found`);
    return user;
  }

  async updateUser(id: string, newProps: Partial<UserData>): Promise<void> {
    if (!Memory.users[id]) throw new NotFoundError(`User not found`);
    Object.assign(Memory.users[id], newProps);
  }

  async deleteUser(id: string): Promise<void> {
    if (!Memory.users[id]) throw new NotFoundError(`User not found`);
    delete Memory.users[id];
  }

  async getUsers(): Promise<User[]> {
    return Object.values(Memory.users);
  }
}
