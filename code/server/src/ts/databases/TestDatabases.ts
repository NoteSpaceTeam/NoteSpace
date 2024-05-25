import { DocumentsRepository, Databases, ResourcesRepository, WorkspacesRepository } from '@databases/types';
import { MemoryResourcesDB } from '@databases/memory/MemoryResourcesDB';
import { MemoryWorkspacesDB } from '@databases/memory/MemoryWorkspacesDB';
import { MemoryDocumentsDB } from '@databases/memory/MemoryDocumentsDB';

export class TestDatabases implements Databases {
  readonly documents: DocumentsRepository;
  readonly resources: ResourcesRepository;
  readonly workspaces: WorkspacesRepository;

  constructor() {
    this.documents = new MemoryDocumentsDB();
    this.resources = new MemoryResourcesDB();
    this.workspaces = new MemoryWorkspacesDB();
  }
}
