import { TestDatabases } from '../../src/databases/TestDatabases';
import { Services } from '../../src/services/Services';
import { getRandomUserId } from '../users/utils';

let services: Services;

beforeEach(() => {
  services = new Services(new TestDatabases());
});

describe('Workspace members operations', () => {
  test('should add a member to a workspace', async () => {
    const wid = await services.workspaces.createWorkspace('test', false);
    const userId = getRandomUserId();
    const userData = {
      name: 'test',
      email: 'test@test.com',
    };
    await services.users.createUser(userId, userData);
    await services.workspaces.addWorkspaceMember(wid, userData.email);
    const workspace = await services.workspaces.getWorkspace(wid);
    expect(workspace.members).toContain(userData.email);
  });

  test('should remove a member from a workspace', async () => {
    const wid = await services.workspaces.createWorkspace('test', false);
    const userId = getRandomUserId();
    const userData = {
      name: 'test',
      email: 'test@test.com',
    };

    // add user to workspace
    await services.users.createUser(userId, userData);
    await services.workspaces.addWorkspaceMember(wid, userData.email);
    const workspace = await services.workspaces.getWorkspace(wid);
    expect(workspace.members).toContain(userData.email);

    // remove user from workspace
    await services.workspaces.removeWorkspaceMember(wid, userData.email);
    const workspaceAfter = await services.workspaces.getWorkspace(wid);
    expect(workspaceAfter.members).not.toContain(userData.email);
  });
});
