import { Services } from '../../src/services/Services';
import { DocumentResource, ResourceType } from '@notespace/shared/src/workspace/types/resource';
import { InsertOperation } from '@notespace/shared/src/document/types/operations';
import { createTestUserAndWorkspace, testServices } from '../utils';

let services: Services;

beforeEach(() => {
  services = testServices();
});

describe('Document operations', () => {
  test('should create a document', async () => {
    const wid = await services.workspaces.createWorkspace('test', false);
    const id = await services.resources.createResource(wid, 'testDoc', ResourceType.DOCUMENT, undefined);
    const document = (await services.resources.getResource(wid, id)) as DocumentResource;
    expect(document.name).toEqual('testDoc');
    expect(document.type).toEqual(ResourceType.DOCUMENT);
    expect(document.content).toEqual([]);
  });

  test('should apply an operation to a document', async () => {
    const wid = await services.workspaces.createWorkspace('test', false);
    const id = await services.resources.createResource(wid, 'testDoc', ResourceType.DOCUMENT, undefined);
    const operation: InsertOperation = {
      type: 'insert',
      id: { sender: 'A', counter: 0 },
      value: 'a',
      parent: { sender: 'root', counter: 0 },
      side: 'R',
      line: 0,
      styles: [],
    };
    await services.documents.applyOperations(wid, id, [operation]);
    const document = (await services.resources.getResource(wid, id)) as DocumentResource;
    expect(document.content).toEqual([operation]);
  });

  test('get recent documents', async () => {
    const { wid, email } = await createTestUserAndWorkspace(services);
    const id = await services.resources.createResource(wid, 'testDoc', ResourceType.DOCUMENT, undefined);
    const documents = await services.resources.getRecentDocuments(email);
    expect(documents).toHaveLength(1);
    expect(documents[0].id).toEqual(id);
  });
});
