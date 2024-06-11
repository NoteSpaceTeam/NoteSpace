import { UsersRepository } from '@databases/types';
import { UserData } from '@notespace/shared/src/users/types';
import sql from '@databases/postgres/config';
import { isEmpty } from 'lodash';
import { NotFoundError } from '@domain/errors/errors';

export class PostgresUsersDB implements UsersRepository {
  async createUser(id: string, data: UserData): Promise<void> {
    await sql`insert into users ${sql({ id, ...data })}`;
  }

  async getUser(id: string): Promise<UserData> {
    const results: UserData[] = await sql`select * from users where id = ${id}`;
    if (isEmpty(results)) throw new NotFoundError('User not found');
    return results[0];
  }

  async updateUser(id: string, newProps: Partial<UserData>): Promise<void> {
    const results = await sql`
        update users
        set ${sql(newProps)}
        where id = ${id}
        returning id
    `;
    if (isEmpty(results)) throw new NotFoundError('User not found');
  }

  async deleteUser(id: string): Promise<void> {
    const results = await sql`
        delete from users
        where id = ${id}
        returning id
    `;
    if (isEmpty(results)) throw new NotFoundError('User not found');
  }
}
