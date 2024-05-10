
import { NoteSpaceDatabase } from '@database/types';
import { ResourcesService } from '@services/resourcesService';
import { WorkspaceService } from '@services/workspaceService';

export class NoteSpaceServices {
  private readonly database : NoteSpaceDatabase;

  readonly resources : ResourcesService;
  readonly workspace : WorkspaceService;

  constructor(private _database : NoteSpaceDatabase) {
    this.database = _database;
    this.resources = new ResourcesService(this.database.resource, this.database.document);
    this.workspace = new WorkspaceService(this.database.workspace);
  }
}