import { PSQLResourcesDB } from '@databases/resources/postgres/PSQLResourcesDB';
import { PSQLWorkspacesDB } from '@databases/resources/postgres/PSQLWorkspacesDB';
import { DocumentsRepository, NoteSpaceDatabase, ResourcesRepository, WorkspacesRepository } from '@databases/types';

export class PSQLDB implements NoteSpaceDatabase{
  readonly document: DocumentsRepository;
  readonly resource: ResourcesRepository;
  readonly workspace: WorkspacesRepository;

  constructor(document: DocumentsRepository) {
    this.document = document;
    this.resource = new PSQLResourcesDB();
    this.workspace = new PSQLWorkspacesDB();
  }
}
