import { PostgresResourcesDB } from '@databases/workspaces/postgres/PostgresResourcesDB';
import { PostgresWorkspacesDB } from '@databases/workspaces/postgres/PostgresWorkspacesDB';
import { DocumentsRepository, Databases, ResourcesRepository, WorkspacesRepository } from '@databases/types';
import { FirestoreDocumentsDB } from '@databases/documents/firestore/FirestoreDocumentsDB';

export class ProductionDatabases implements Databases {
  readonly document: DocumentsRepository;
  readonly resource: ResourcesRepository;
  readonly workspace: WorkspacesRepository;

  constructor() {
    this.document = new FirestoreDocumentsDB();
    this.resource = new PostgresResourcesDB();
    this.workspace = new PostgresWorkspacesDB();
  }
}
