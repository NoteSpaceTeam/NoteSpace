import { TestDatabases } from '../../src/databases/TestDatabases';
import { Services } from '../../src/services/Services';
import { ResourceType } from '@notespace/shared/src/workspace/types/resource';
import { excludeRoot } from './utils';

let services: Services;

beforeEach(() => {
  services = new Services(new TestDatabases());
});

describe('Workspace tree operations', () => {
  test('should return an empty tree', async () => {
    const id = await services.workspaces.createWorkspace('test', false);
    const resources = await services.workspaces.getResources(id);
    expect(resources.length).toBe(1);
  });

  test('should return a tree with one document', async () => {
    const id = await services.workspaces.createWorkspace('test', false);
    const docId = await services.resources.createResource(id, 'testDoc', ResourceType.DOCUMENT);
    const resources = excludeRoot(id, await services.workspaces.getResources(id));
    expect(resources.length).toBe(1);
    expect(resources[0].id).toBe(docId);
    expect(resources[0].type).toBe(ResourceType.DOCUMENT);
  });

  test('should return a tree with one document inside a folder', async () => {
    const id = await services.workspaces.createWorkspace('test', false);
    const folderId = await services.resources.createResource(id, 'testFolder', ResourceType.FOLDER);
    const docId = await services.resources.createResource(id, 'testDoc', ResourceType.DOCUMENT, folderId);
    const resources = excludeRoot(id, await services.workspaces.getResources(id));

    expect(resources.length).toBe(2);
    expect(resources[0].id).toBe(folderId);
    expect(resources[0].type).toBe(ResourceType.FOLDER);
    expect(resources[1].id).toBe(docId);
    expect(resources[1].type).toBe(ResourceType.DOCUMENT);
    expect(resources[1].parent).toBe(folderId);
    expect(resources[0].children).toEqual([docId]);
  });

  test('should return a tree with one document inside a folder inside a folder', async () => {
    const id = await services.workspaces.createWorkspace('test', false);
    const folderId1 = await services.resources.createResource(id, 'testFolder1', ResourceType.FOLDER);
    const folderId2 = await services.resources.createResource(id, 'testFolder2', ResourceType.FOLDER, folderId1);
    const docId = await services.resources.createResource(id, 'testDoc', ResourceType.DOCUMENT, folderId2);
    const resources = excludeRoot(id, await services.workspaces.getResources(id));

    expect(resources.length).toBe(3);
    expect(resources[0].id).toBe(folderId1);
    expect(resources[0].type).toBe(ResourceType.FOLDER);
    expect(resources[1].id).toBe(folderId2);
    expect(resources[1].type).toBe(ResourceType.FOLDER);
    expect(resources[2].id).toBe(docId);
    expect(resources[2].type).toBe(ResourceType.DOCUMENT);
    expect(resources[2].parent).toBe(folderId2);
    expect(resources[1].children).toEqual([docId]);
    expect(resources[0].children).toEqual([folderId2]);
  });

  test('should delete a single resource', async () => {
    const wid = await services.workspaces.createWorkspace('test', false);
    const docId = await services.resources.createResource(wid, 'doc1', ResourceType.DOCUMENT);
    await services.resources.deleteResource(docId);
    const resources = excludeRoot(wid, await services.workspaces.getResources(wid));
    expect(resources.length).toBe(0);
  });

  test('should delete a resource and all its descendants', async () => {
    const wid = await services.workspaces.createWorkspace('test', false);
    const folderId = await services.resources.createResource(wid, 'folder', ResourceType.FOLDER);
    const docId = await services.resources.createResource(wid, 'doc1', ResourceType.DOCUMENT, folderId);
    await services.resources.createResource(wid, 'doc2', ResourceType.DOCUMENT, docId);
    await services.resources.deleteResource(folderId);
    const resources = excludeRoot(wid, await services.workspaces.getResources(wid));
    console.log(resources);
    expect(resources.length).toBe(0);
  });
});
