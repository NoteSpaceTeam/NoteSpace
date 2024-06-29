import { Services } from '../../src/services/Services';
import { ResourceType } from '@notespace/shared/src/workspace/types/resource';
import { excludeRoot, testServices } from '../utils';

let services: Services;

beforeEach(() => {
  services = testServices();
});

describe('Resource operations', () => {
  test('should create a resource', async () => {
    const wid = await services.workspaces.createWorkspace('test', false);
    const id = await services.resources.createResource(wid, 'testDoc', ResourceType.DOCUMENT);
    const resource = await services.resources.getResource(wid, id);
    expect(resource.name).toEqual('testDoc');
    expect(resource.type).toEqual(ResourceType.DOCUMENT);
  });

  test('should delete a resource', async () => {
    const wid = await services.workspaces.createWorkspace('test', false);
    const id = await services.resources.createResource(wid, 'testDoc', ResourceType.DOCUMENT);
    await services.resources.deleteResource(id);
    const resources = excludeRoot(wid, await services.workspaces.getResources(wid));
    expect(resources).toEqual([]);
  });

  test('should update a resource', async () => {
    const wid = await services.workspaces.createWorkspace('test', false);
    const id = await services.resources.createResource(wid, 'testDoc', ResourceType.DOCUMENT);
    await services.resources.updateResource(id, { name: 'testDoc2' });
    const resource = await services.resources.getResource(wid, id);
    expect(resource.name).toEqual('testDoc2');
  });

  test('should get all resources', async () => {
    const wid = await services.workspaces.createWorkspace('test', false);
    await services.resources.createResource(wid, 'testDoc', ResourceType.DOCUMENT);
    await services.resources.createResource(wid, 'testDoc2', ResourceType.DOCUMENT);
    const resources = excludeRoot(wid, await services.workspaces.getResources(wid));
    expect(resources.length).toEqual(2);
  });
});
