import { Services } from '../../src/services/Services';
import { createTestUserAndWorkspace, testServices } from '../utils';

let services: Services;

beforeEach(() => {
  services = testServices();
});

describe('Workspace members operations', () => {
  test('should add a member to a workspace', async () => {
    const { wid, email } = await createTestUserAndWorkspace(services);
    const workspace = await services.workspaces.getWorkspace(wid);
    const userWorkspaces = await services.workspaces.getWorkspaces(email);

    expect(workspace.members).toContain(email);
    expect(userWorkspaces[0].id).toBe(wid);
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
