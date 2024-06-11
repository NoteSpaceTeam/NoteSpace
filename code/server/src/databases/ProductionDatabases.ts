import {
  DocumentsRepository,
  Databases,
  ResourcesRepository,
  WorkspacesRepository,
  UsersRepository,
} from '@databases/types';
import { PostgresResourcesDB } from '@databases/postgres/PostgresResourcesDB';
import { PostgresWorkspacesDB } from '@databases/postgres/PostgresWorkspacesDB';
import { FirestoreDocumentsDB } from '@databases/firestore/FirestoreDocumentsDB';
import { PostgresUsersDB } from '@databases/postgres/PostgresUsersDB';

export class ProductionDatabases implements Databases {
  readonly documents: DocumentsRepository;
  readonly resources: ResourcesRepository;
  readonly workspaces: WorkspacesRepository;
  readonly users: UsersRepository;

  constructor() {
    this.documents = new FirestoreDocumentsDB();
    this.resources = new PostgresResourcesDB();
    this.workspaces = new PostgresWorkspacesDB();
    this.users = new PostgresUsersDB();
  }
}
