
import { NoteSpaceDatabase } from '@database/types';
import { DocumentService } from '@services/documentService';
import { ResourcesService } from '@services/resourcesService';
import { WorkspaceService } from '@services/workspaceService';

export class NoteSpaceServices {
  private readonly database : NoteSpaceDatabase;

  private readonly document : DocumentService;
  private readonly resources : ResourcesService;
  private readonly workspace : WorkspaceService;

  constructor(private _database : NoteSpaceDatabase) {
    this.database = _database;
    this.document = new DocumentService(this.database.document);
    this.resources = new ResourcesService(this.database.resource);
    this.workspace = new WorkspaceService(this.database.workspace);
  }
}