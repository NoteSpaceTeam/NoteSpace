import { getRandomId } from '../src/services/utils';
import { Services } from '../src/services/Services';
import { Resource, ResourceType } from '@notespace/shared/src/workspace/types/resource';
import { InsertOperation } from '@notespace/shared/src/document/types/operations';
import { Author } from '@notespace/shared/src/document/types/commits';

export async function createTestUserAndWorkspace(services: Services) {
  const userId = getRandomId();
  const name = 'testUser';
  const email = 'testUser@test.com';
  await services.users.createUser(userId, { email, name });
  const wid = await services.workspaces.createWorkspace('test', false);
  await services.workspaces.addWorkspaceMember(wid, email);
  return { wid, email, name, userId };
}

export async function createTestCommit(services: Services) {
  const { wid, name, userId } = await createTestUserAndWorkspace(services);

  // create document and apply operations
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

  // commit changes
  const commitId = await services.documents.commit(id, { id: userId, name });
  const author: Author = { id: userId, name };

  return { wid, id, author, commitId, operation };
}

export function excludeRoot(wid: string, resources: Resource[]): Resource[] {
  return resources.filter(r => r.id != wid);
}
