import { Services } from '../../src/services/Services';
import { WorkspaceMeta } from '@notespace/shared/src/workspace/types/workspace';
import { testServices } from '../utils';

let services: Services;

beforeEach(() => {
  services = testServices();
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
    await services.workspaces.updateWorkspace(id, { name: 'test2' });
    const workspace = await services.workspaces.getWorkspace(id);
    expect(workspace.name).toEqual('test2');
  });

  test('should get all workspaces', async () => {
    await services.workspaces.createWorkspace('test', false);
    await services.workspaces.createWorkspace('test2', false);
    const workspaces = await services.workspaces.getWorkspaces();
    expect(workspaces.length).toEqual(2);
  });

  test('should search for a workspace by name', async () => {
    await services.workspaces.createWorkspace('workspace', false);
    await services.workspaces.createWorkspace('work', false);
    const searchParams = { query: 'work', limit: 2, skip: 0 };
    const workspaces: WorkspaceMeta[] = await services.workspaces.searchWorkspaces(searchParams);
    const workspaceNames = workspaces.map(w => w.name);
    expect(workspaceNames).toContain('workspace');
    expect(workspaceNames).toContain('work');
  });
});
