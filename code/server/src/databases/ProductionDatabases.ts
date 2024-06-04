import { PostgresResourcesDB } from '@databases/postgres/PostgresResourcesDB';
import { PostgresWorkspacesDB } from '@databases/postgres/PostgresWorkspacesDB';
import { DocumentsRepository, Databases, ResourcesRepository, WorkspacesRepository } from '@databases/types';
import { FirestoreDocumentsDB } from '@databases/firestore/FirestoreDocumentsDB';

export class ProductionDatabases implements Databases {
  readonly documents: DocumentsRepository;
  readonly resources: ResourcesRepository;
  readonly workspaces: WorkspacesRepository;

  constructor() {
    this.documents = new FirestoreDocumentsDB();
    this.resources = new PostgresResourcesDB();
    this.workspaces = new PostgresWorkspacesDB();
  }
}
