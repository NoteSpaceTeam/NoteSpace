import { TestDatabases } from '../../src/databases/TestDatabases';
import { Services } from '../../src/services/Services';
import { createTestUserAndWorkspace } from '../utils';

let services: Services;

beforeEach(() => {
  services = new Services(new TestDatabases());
});

describe('Workspace members operations', () => {
  test('should add a member to a workspace', async () => {
    const { wid, email } = await createTestUserAndWorkspace(services);
    const workspace = await services.workspaces.getWorkspace(wid);
    expect(workspace.members).toContain(email);
  });

  test('should remove a member from a workspace', async () => {
    const { wid, email } = await createTestUserAndWorkspace(services);

    const workspace = await services.workspaces.getWorkspace(wid);
    expect(workspace.members).toContain(email);

    // remove user from workspace
    await services.workspaces.removeWorkspaceMember(wid, email);
    const workspaceAfter = await services.workspaces.getWorkspace(wid);
    expect(workspaceAfter.members).not.toContain(email);
  });
});
