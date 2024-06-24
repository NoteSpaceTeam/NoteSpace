import { Operation } from '@notespace/shared/src/document/types/operations';
import { Databases } from '@databases/types';
import { decodeFromBase64, encodeToBase64 } from '@services/utils';
import { Author, Commit } from '@notespace/shared/src/document/types/commits';
import { Resource, ResourceType } from '@notespace/shared/src/workspace/types/resource';

export class DocumentsService {
  private readonly databases: Databases;

  constructor(databases: Databases) {
    this.databases = databases;
  }

  async updateDocument(wid: string, id: string, operations: Operation[]) {
    // update document operations
    await this.databases.documents.updateDocument(wid, id, operations, false);
    // update resource modified time
    await this.databases.resources.updateResource(id, { updatedAt: new Date().toISOString() });
  }

  async commit(id: string, author: Author) {
    // get document operations
    const resource = await this.getDocumentResource(id);
    const document = await this.databases.documents.getDocument(resource.workspace, id);
    // save operations in new commit
    const content = encodeToBase64(document.operations);
    const commit: Commit = { id: resource.id, content, timestamp: Date.now(), author };
    await this.databases.commits.saveCommit(id, commit);
  }

  async rollback(id: string, commitId: string) {
    // get operations from commit
    const resource = await this.getDocumentResource(id);
    const commit = await this.databases.commits.getCommit(id, commitId);

    // update document with operations
    const operations = decodeFromBase64(commit.content) as Operation[];
    await this.databases.documents.updateDocument(resource.workspace, id, operations, true);
  }

  async fork(id: string, commitId: string) {
    // get operations from commit
    const resource = await this.getDocumentResource(id);
    const commit = await this.databases.commits.getCommit(id, commitId);
    const operations = decodeFromBase64(commit.content) as Operation[];

    // create new document with operations
    const newResource: Resource = {
      ...resource,
      id,
      name: `${resource.name}-forked`,
      parent: resource.workspace,
    };
    const newId = await this.databases.resources.createResource(
      newResource.workspace,
      newResource.name,
      ResourceType.DOCUMENT,
      newResource.parent
    );
    await this.databases.documents.createDocument(resource.workspace, newId);
    await this.databases.documents.updateDocument(resource.workspace, newId, operations, true);
    return newResource;
  }

  async getCommits(id: string) {
    // check if document exists
    await this.getDocumentResource(id);
    // get all commits of a document
    return await this.databases.commits.getCommits(id);
  }

  private async getDocumentResource(id: string) {
    const resource = await this.databases.resources.getResource(id);
    if (resource.type !== ResourceType.DOCUMENT) throw new Error('Resource is not a document');
    return resource;
  }
}
