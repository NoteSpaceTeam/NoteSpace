import { Databases } from '@databases/types';
import { User, UserData } from '@notespace/shared/src/users/types';
import { validateId } from '@services/utils';

export class UsersService {
  private readonly databases: Databases;

  constructor(databases: Databases) {
    this.databases = databases;
  }

  async createUser(id: string, data: UserData): Promise<void> {
    validateId(id);
    await this.databases.users.createUser(id, data);
  }

  async getUser(id: string): Promise<User> {
    validateId(id);
    return await this.databases.users.getUser(id);
  }

  async deleteUser(id: string): Promise<void> {
    validateId(id);
    await this.databases.users.deleteUser(id);
  }

  async getUsers(): Promise<User[]> {
    return await this.databases.users.getUsers();
  }
}
