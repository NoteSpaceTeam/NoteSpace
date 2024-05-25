import { TestDatabases } from '../../src/ts/databases/TestDatabases';
import { Services } from '../../src/ts/services/Services';
import { Resource, ResourceType } from '@notespace/shared/src/workspace/types/resource';

let services: Services;

beforeEach(() => {
  services = new Services(new TestDatabases());
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
    const resources = (await services.resources.getResources(wid)) as Resource[];
    expect(resources.filter(r => r.id !== wid)).toEqual([]);
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
    const resources = (await services.resources.getResources(wid)) as Resource[];
    expect(resources.filter(r => r.id !== wid).length).toEqual(2);
  });

  test('should get all resources of a type', async () => {
    const wid = await services.workspaces.createWorkspace('test', false);
    await services.resources.createResource(wid, 'testDoc', ResourceType.DOCUMENT);
    await services.resources.createResource(wid, 'testFolder', ResourceType.FOLDER);
    const resources = (await services.resources.getResources(wid, ResourceType.DOCUMENT)) as Resource[];
    expect(resources.filter(r => r.id !== wid).length).toEqual(1);
  });
});
