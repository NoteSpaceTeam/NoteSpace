import { TestDatabases } from '../../src/ts/databases/TestDatabases';
import { Services } from '../../src/ts/services/Services';

let services: Services;

beforeEach(() => {
  services = new Services(new TestDatabases());
});

describe('Workspace operations', () => {
  test('should create a workspace', async () => {
    const id = await services.workspace.createWorkspace('test', false);
    const workspace = await services.workspace.getWorkspace(id);
    expect(workspace.name).toEqual('test');
    expect(workspace.id).toEqual(id);
  });

  test('should delete a workspace', async () => {
    const id = await services.workspace.createWorkspace('test', false);
    await services.workspace.deleteWorkspace(id);
    const workspaces = await services.workspace.getWorkspaces();
    expect(workspaces).toEqual([]);
  });

  test('should update a workspace', async () => {
    const id = await services.workspace.createWorkspace('test', false);
    await services.workspace.updateWorkspace(id, 'test2');
    const workspace = await services.workspace.getWorkspace(id);
    expect(workspace.name).toEqual('test2');
  });

  test('should get all workspaces', async () => {
    await services.workspace.createWorkspace('test', false);
    await services.workspace.createWorkspace('test2', false);
    const workspaces = await services.workspace.getWorkspaces();
    expect(workspaces.length).toEqual(2);
  });
});
