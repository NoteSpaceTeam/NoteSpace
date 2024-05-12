import { DocumentsRepository, Databases, ResourcesRepository, WorkspacesRepository } from '@databases/types';
import { MemoryResourcesDB } from '@databases/memory/MemoryResourcesDB';
import { MemoryWorkspacesDB } from '@databases/memory/MemoryWorkspacesDB';
import { MemoryDocumentsDB } from '@databases/memory/MemoryDocumentsDB';

export class TestDatabases implements Databases {
  readonly document: DocumentsRepository;
  readonly resource: ResourcesRepository;
  readonly workspace: WorkspacesRepository;

  constructor() {
    this.document = new MemoryDocumentsDB();
    this.resource = new MemoryResourcesDB();
    this.workspace = new MemoryWorkspacesDB();
  }
}
