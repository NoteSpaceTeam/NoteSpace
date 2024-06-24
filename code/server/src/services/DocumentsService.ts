import { Operation } from '@notespace/shared/src/document/types/operations';
import { Databases } from '@databases/types';
import { decodeFromBase64, encodeToBase64, getRandomId } from '@services/utils';
import { Author, Commit, CommitData } from '@notespace/shared/src/document/types/commits';
import { DocumentResource, Resource, ResourceType } from '@notespace/shared/src/workspace/types/resource';

const COMMIT_ID_LENGTH = 8;

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
    const commitId = getRandomId(COMMIT_ID_LENGTH);
    const commit: Commit = { id: commitId, content, timestamp: Date.now(), author };
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

  async fork(id: string, commitId: string): Promise<DocumentResource> {
    // get operations from commit
    const resource = await this.getDocumentResource(id);
    const commit = await this.databases.commits.getCommit(id, commitId);
    const operations = decodeFromBase64(commit.content) as Operation[];

    // create new document with operations
    const newResource: DocumentResource = {
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

  async getCommits(id: string): Promise<Commit[]> {
    // check if document exists
    await this.getDocumentResource(id);
    // get all commits of a document
    return await this.databases.commits.getCommits(id);
  }

  async getCommit(id: string, commitId: string): Promise<CommitData> {
    // check if document exists
    await this.getDocumentResource(id);
    // get commit of a document
    const commit = await this.databases.commits.getCommit(id, commitId);
    return { ...commit, content: decodeFromBase64(commit.content) as Operation[] };
  }

  private async getDocumentResource(id: string): Promise<DocumentResource> {
    const resource = await this.databases.resources.getResource(id);
    if (resource.type !== ResourceType.DOCUMENT) throw new Error('Resource is not a document');
    return resource as DocumentResource;
  }
}
