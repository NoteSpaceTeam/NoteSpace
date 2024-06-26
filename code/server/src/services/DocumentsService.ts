import { Operation } from '@notespace/shared/src/document/types/operations';
import { Databases } from '@databases/types';
import { decodeFromBase64, encodeToBase64, getRandomId, validateId } from '@services/utils';
import { Author, Commit, CommitData, CommitMeta } from '@notespace/shared/src/document/types/commits';
import { DocumentResource, ResourceType } from '@notespace/shared/src/workspace/types/resource';

const COMMIT_ID_LENGTH = 8;

export class DocumentsService {
  private readonly databases: Databases;

  constructor(databases: Databases) {
    this.databases = databases;
  }

  async applyOperations(wid: string, id: string, operations: Operation[]) {
    validateId(wid);
    validateId(id);
    if (!operations.length) throw new Error('No operations to update');
    // update document operations
    await this.databases.documents.updateDocument(wid, id, operations, false);
    // update resource modified time
    await this.databases.resources.updateResource(id, { updatedAt: new Date().toISOString() });
  }

  async commit(id: string, author: Author): Promise<string> {
    validateId(id);
    // get document operations
    const resource = await this.getDocumentResource(id);
    const document = await this.databases.documents.getDocument(resource.workspace, id);
    // save operations in new commit
    const content = encodeToBase64(document.operations);
    const commitId = getRandomId(COMMIT_ID_LENGTH);
    const commit: Commit = { id: commitId, content, timestamp: Date.now(), author };
    await this.databases.commits.saveCommit(id, commit);
    return commitId;
  }

  async rollback(id: string, commitId: string) {
    validateId(id);
    validateId(commitId);
    // get operations from commit
    const resource = await this.getDocumentResource(id);
    const commit = await this.databases.commits.getCommit(id, commitId);

    // update document with operations
    const operations = decodeFromBase64(commit.content) as Operation[];
    await this.databases.documents.updateDocument(resource.workspace, id, operations, true);
  }

  async clone(id: string, commitId: string): Promise<DocumentResource> {
    validateId(id);
    validateId(commitId);
    // get operations from commit
    const resource = await this.getDocumentResource(id);
    const commit = await this.databases.commits.getCommit(id, commitId);
    const operations = decodeFromBase64(commit.content) as Operation[];

    // create new document with operations
    const name = `${resource.name}-cloned`;
    const newId = await this.databases.resources.createResource(
      resource.workspace,
      name,
      ResourceType.DOCUMENT,
      resource.workspace
    );
    await this.databases.documents.createDocument(resource.workspace, newId);
    await this.databases.documents.updateDocument(resource.workspace, newId, operations, true);
    return {
      ...resource,
      id: newId,
      name,
      parent: resource.workspace,
    };
  }

  async getCommits(id: string): Promise<CommitMeta[]> {
    validateId(id);
    // check if document exists
    await this.getDocumentResource(id);
    // get all commits of a document
    return await this.databases.commits.getCommits(id);
  }

  async getCommit(id: string, commitId: string): Promise<CommitData> {
    validateId(id);
    validateId(commitId);
    // check if document exists
    await this.getDocumentResource(id);
    // get commit of a document
    const commit = await this.databases.commits.getCommit(id, commitId);
    return { ...commit, content: decodeFromBase64(commit.content) as Operation[] };
  }

  private async getDocumentResource(id: string): Promise<DocumentResource> {
    validateId(id);
    const resource = await this.databases.resources.getResource(id);
    if (resource.type !== ResourceType.DOCUMENT) throw new Error('Resource is not a document');
    return resource as DocumentResource;
  }
}
