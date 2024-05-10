import { DocumentDatabase, NoteSpaceDatabase, ResourceDatabase, WorkspaceDatabase } from '@database/types';
import { ResourcesDB } from '@database/pg/resourcesDB';
import { WorkspaceDB } from '@database/pg/workspaceDB';

export class NoteSpaceDB implements NoteSpaceDatabase{
  readonly document: DocumentDatabase;
  readonly resource: ResourceDatabase;
  readonly workspace: WorkspaceDatabase;

  constructor(document: DocumentDatabase) {
    this.document = document;
    this.resource = new ResourcesDB();
    this.workspace = new WorkspaceDB();
  }
}