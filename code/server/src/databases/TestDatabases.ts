import {
  DocumentsRepository,
  Databases,
  ResourcesRepository,
  WorkspacesRepository,
  UsersRepository,
  CommitsRepository,
} from '@databases/types';
import { MemoryResourcesDB } from '@databases/memory/MemoryResourcesDB';
import { MemoryWorkspacesDB } from '@databases/memory/MemoryWorkspacesDB';
import { MemoryDocumentsDB } from '@databases/memory/MemoryDocumentsDB';
import { MemoryUsersDB } from '@databases/memory/MemoryUsersDB';
import { MemoryCommitsDB } from '@databases/memory/MemoryCommitsDB';

export class TestDatabases implements Databases {
  readonly documents: DocumentsRepository;
  readonly resources: ResourcesRepository;
  readonly workspaces: WorkspacesRepository;
  readonly users: UsersRepository;
  readonly commits: CommitsRepository;

  constructor() {
    this.documents = new MemoryDocumentsDB();
    this.resources = new MemoryResourcesDB();
    this.workspaces = new MemoryWorkspacesDB();
    this.users = new MemoryUsersDB();
    this.commits = new MemoryCommitsDB();
  }
}
