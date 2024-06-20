import { Databases } from '@databases/types';
import { User, UserData } from '@notespace/shared/src/users/types';

export class UsersService {
  private readonly databases: Databases;

  constructor(databases: Databases) {
    this.databases = databases;
  }

  async createUser(id: string, data: UserData): Promise<void> {
    await this.databases.users.createUser(id, data);
  }

  async getUser(id: string): Promise<User> {
    return await this.databases.users.getUser(id);
  }

  async updateUser(id: string, newProps: Partial<UserData>): Promise<void> {
    await this.databases.users.updateUser(id, newProps);
  }

  async deleteUser(id: string): Promise<void> {
    await this.databases.users.deleteUser(id);
  }

  async getUsers(): Promise<User[]> {
    return await this.databases.users.getUsers();
  }
}
