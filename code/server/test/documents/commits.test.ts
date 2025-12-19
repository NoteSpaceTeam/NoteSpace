import { Services } from '../../src/services/Services';
import { DocumentResource } from '@notespace/shared/src/workspace/types/resource';
import { DeleteOperation } from '@notespace/shared/src/document/types/operations';
import { createTestCommit, testServices } from '../utils';

let services: Services;

beforeEach(() => {
  services = testServices();
});

describe('Commit operations', () => {
  test('should create a commit', async () => {
    const { wid, id, commitId, operation } = await createTestCommit(services);

    // apply more operations
    const operation2: DeleteOperation = {
      type: 'delete',
      id: { sender: 'A', counter: 0 },
    };
    await services.documents.applyOperations(wid, id, [operation2]);
    const document = (await services.resources.getResource(wid, id)) as DocumentResource;
    expect(document.content).toEqual([operation, operation2]);

    // get commit and compare content
    const commit = await services.documents.getCommit(id, commitId);
    expect(commit.content).toEqual([operation]);
  });

  test('should rollback a commit', async () => {
    const { wid, id, commitId, operation } = await createTestCommit(services);

    // apply more operations
    const operation2: DeleteOperation = {
      type: 'delete',
      id: { sender: 'A', counter: 0 },
    };
    await services.documents.applyOperations(wid, id, [operation2]);

    // rollback commit
    await services.documents.rollback(id, commitId);

    // get document and compare content
    const document = (await services.resources.getResource(wid, id)) as DocumentResource;
    expect(document.content).toEqual([operation]);
  });

  test('should clone a commit', async () => {
    const { wid, id, commitId, operation } = await createTestCommit(services);

    // clone commit
    const clonedDocument = await services.documents.clone(id, commitId);

    // get document and compare content
    const document = (await services.resources.getResource(wid, clonedDocument.id)) as DocumentResource;
    expect(document.content).toEqual([operation]);
  });

  test('should get all commits', async () => {
    const { id, commitId, author } = await createTestCommit(services);

    // create another commit
    await services.documents.commit(id, author);

    // get all commits
    const commits = await services.documents.getCommits(id);
    expect(commits.length).toBe(2);
    expect(commits.some(c => c.id === commitId)).toBe(true);
  });
});
