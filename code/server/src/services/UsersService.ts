import { UsersRepository } from '@databases/types';
import { User, UserData } from '@notespace/shared/src/users/types';

export class UsersService {
  private readonly users: UsersRepository;

  constructor(users: UsersRepository) {
    this.users = users;
  }

  async createUser(id: string, data: UserData): Promise<void> {
    await this.users.createUser(id, data);
  }

  async getUser(id: string): Promise<User> {
    return await this.users.getUser(id);
  }

  async updateUser(id: string, newProps: Partial<UserData>): Promise<void> {
    await this.users.updateUser(id, newProps);
  }

  async deleteUser(id: string): Promise<void> {
    await this.users.deleteUser(id);
  }

  async getUsers(): Promise<User[]> {
    return await this.users.getUsers();
  }
}
