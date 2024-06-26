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
    const userData = {
      name: 'test',
      email: 'test@test.com',
    };
    await services.users.createUser(id, userData);
    const user = await services.users.getUser(id);
    expect(user.name).toEqual('test');
    expect(user.email).toEqual('test@test.com');
  });

  test('should delete a user', async () => {
    const id = getRandomId();
    const userData = {
      name: 'test',
      email: 'test@test.com',
    };
    await services.users.createUser(id, userData);
    await services.users.deleteUser(id);
    await expect(services.users.getUser(id)).rejects.toThrow('User not found');
  });

  test('should get all users', async () => {
    const id1 = getRandomId();
    const user1Data = {
      name: 'test1',
      email: 'test1@test.com',
    };
    const id2 = getRandomId();
    const user2Data = {
      name: 'test2',
      email: 'test2@test.com',
    };
    await services.users.createUser(id1, user1Data);
    await services.users.createUser(id2, user2Data);
    const users: User[] = await services.users.getUsers();
    expect(users.some(u => u.id === id1)).toBe(true);
    expect(users.some(u => u.id === id2)).toBe(true);
  });
});
