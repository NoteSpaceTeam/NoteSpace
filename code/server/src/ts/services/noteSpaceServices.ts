import { ResourcesService } from '@services/resourcesService';
import { WorkspaceService } from '@services/workspaceService';
import { NoteSpaceDatabases } from '@database/noteSpaceDB';

export class NoteSpaceServices {
  private readonly databases: NoteSpaceDatabases;

  readonly resources: ResourcesService;
  readonly workspace: WorkspaceService;

  constructor(databases: NoteSpaceDatabases) {
    this.databases = databases;
    this.resources = new ResourcesService(this.databases.resource, this.databases.document);
    this.workspace = new WorkspaceService(this.databases.workspace);
  }
}
