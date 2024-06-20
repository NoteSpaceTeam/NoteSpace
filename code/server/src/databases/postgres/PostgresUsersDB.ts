import { UsersRepository } from '@databases/types';
import { User, UserData } from '@notespace/shared/src/users/types';
import sql from '@databases/postgres/config';
import { isEmpty } from 'lodash';
import { NotFoundError } from '@domain/errors/errors';

export class PostgresUsersDB implements UsersRepository {
  async createUser(id: string, data: UserData): Promise<void> {
    await sql`insert into "user" ${sql({ id, ...data })}`;
  }

  async getUser(id: string): Promise<User> {
    const results: User[] = await sql`select * from "user" where id = ${id}`;
    if (isEmpty(results)) throw new NotFoundError('User not found');
    return results[0];
  }

  async updateUser(id: string, newProps: Partial<UserData>): Promise<void> {
    const results = await sql`
        update "user"
        set ${sql(newProps)}
        where id = ${id}
        returning id
    `;
    if (isEmpty(results)) throw new NotFoundError('User not found');
  }

  async deleteUser(id: string): Promise<void> {
    const results = await sql`
        delete from "user"
        where id = ${id}
        returning id
    `;
    if (isEmpty(results)) throw new NotFoundError('User not found');
  }

  async getUsers(): Promise<User[]> {
    return await sql`select * from "user"`;
  }

  async getUserByEmail(email: string): Promise<User> {
    const results: User[] = await sql`select * from "user" where email = ${email}`;
    if (isEmpty(results)) throw new NotFoundError('User not found');
    return results[0];
  }
}
