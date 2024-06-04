import { TestDatabases } from '../../src/databases/TestDatabases';
import { Services } from '../../src/services/Services';

let services: Services;

beforeEach(() => {
  services = new Services(new TestDatabases());
});

describe('Workspace operations', () => {
  test('should create a workspace', async () => {
    const id = await services.workspaces.createWorkspace('test', false);
    const workspace = await services.workspaces.getWorkspace(id);
    expect(workspace.name).toEqual('test');
    expect(workspace.id).toEqual(id);
  });

  test('should delete a workspace', async () => {
    const id = await services.workspaces.createWorkspace('test', false);
    await services.workspaces.deleteWorkspace(id);
    const workspaces = await services.workspaces.getWorkspaces();
    expect(workspaces).toEqual([]);
  });

  test('should update a workspace', async () => {
    const id = await services.workspaces.createWorkspace('test', false);
    await services.workspaces.updateWorkspace(id, 'test2');
    const workspace = await services.workspaces.getWorkspace(id);
    expect(workspace.name).toEqual('test2');
  });

  test('should get all workspaces', async () => {
    await services.workspaces.createWorkspace('test', false);
    await services.workspaces.createWorkspace('test2', false);
    const workspaces = await services.workspaces.getWorkspaces();
    expect(workspaces.length).toEqual(2);
  });
});
