import { TestDatabases } from '../../src/databases/TestDatabases';
import { Services } from '../../src/services/Services';
import { User } from '@notespace/shared/src/users/types';
import { getRandomId } from '../../src/services/utils';

let services: Services;

beforeEach(() => {
  services = new Services(new TestDatabases());
});

describe('User operations', () => {
  test('should create a user', async () => {
    const id = getRandomId();
    const name = 'test';
    const email = 'test@test.com';
    await services.users.createUser(id, name, email);
    const user = await services.users.getUser(id);
    expect(user.name).toEqual(name);
    expect(user.email).toEqual(email);
  });

  test('should delete a user', async () => {
    const id = getRandomId();
    await services.users.createUser(id, 'test', 'test@email.com');
    await services.users.deleteUser(id);
    await expect(services.users.getUser(id)).rejects.toThrow('User not found');
  });

  test('should get all users', async () => {
    const id1 = getRandomId();
    const id2 = getRandomId();
    await services.users.createUser(id1, 'test1', 'test1@test.com');
    await services.users.createUser(id2, 'test2', 'test2@test.com');
    const users: User[] = await services.users.getUsers();
    expect(users.some(u => u.id === id1)).toBe(true);
    expect(users.some(u => u.id === id2)).toBe(true);
  });
});
