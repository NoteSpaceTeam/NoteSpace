import { Operation } from '@notespace/shared/src/document/types/operations';
import { Databases } from '@databases/types';
import { decodeFromBase64, encodeToBase64 } from '@services/utils';
import { DocumentVersion } from '@notespace/shared/src/document/types/versions';
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

  async commit(id: string) {
    // get document operations
    const resource = await this.getDocumentResource(id);
    const document = await this.databases.documents.getDocument(resource.workspace, id);
    // save operations as new version
    const content = encodeToBase64(document.operations);
    const version: DocumentVersion = { id: resource.id, content, timestamp: Date.now() };
    await this.databases.versions.saveVersion(id, version);
  }

  async rollback(id: string, versionId: string) {
    // get operations from version
    const resource = await this.getDocumentResource(id);
    const version = await this.databases.versions.getVersion(id, versionId);

    // update document with operations
    const operations = decodeFromBase64(version.content) as Operation[];
    await this.databases.documents.updateDocument(resource.workspace, id, operations, true);
  }

  async fork(id: string, versionId: string) {
    // get operations from version
    const resource = await this.getDocumentResource(id);
    const version = await this.databases.versions.getVersion(id, versionId);
    const operations = decodeFromBase64(version.content) as Operation[];

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

  async getVersions(id: string) {
    // check if document exists
    await this.getDocumentResource(id);
    // get all versions of a document
    const versions = await this.databases.versions.getVersions(id);
    return versions.map(({ id, timestamp }) => ({ id, timestamp }));
  }

  private async getDocumentResource(id: string) {
    const resource = await this.databases.resources.getResource(id);
    if (resource.type !== ResourceType.DOCUMENT) throw new Error('Resource is not a document');
    return resource;
  }
}
