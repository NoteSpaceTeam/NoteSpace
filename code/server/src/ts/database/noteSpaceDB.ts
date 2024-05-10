import { DocumentDatabase, ResourceDatabase, WorkspaceDatabase } from '@database/types';
import { ResourcesDB } from '@database/pg/resourcesDB';
import { WorkspaceDB } from '@database/pg/workspaceDB';

export class NoteSpaceDatabases {
  readonly document: DocumentDatabase;
  readonly resource: ResourceDatabase;
  readonly workspace: WorkspaceDatabase;

  constructor(docDB: DocumentDatabase) {
    this.document = docDB;
    this.resource = new ResourcesDB();
    this.workspace = new WorkspaceDB();
  }
}
