import { ResourcesService } from '@services/ResourcesService';
import { WorkspacesService } from '@services/WorkspacesService';
import { NoteSpaceDatabase } from '@databases/types';

export class Services {
  private readonly databases: NoteSpaceDatabase;

  readonly resources: ResourcesService;
  readonly workspace: WorkspacesService;

  constructor(databases: NoteSpaceDatabase) {
    this.databases = databases;
    this.resources = new ResourcesService(this.databases.resource, this.databases.document);
    this.workspace = new WorkspacesService(this.databases.workspace);
  }
}
