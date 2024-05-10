import { DocumentRepository, ResourceRepository, WorkspaceRepository } from '@database/types';
import { PostgresResourceDatabase } from '@database/postgres/PostgresResourceDatabase';
import { PostgresWorkspaceDatabase } from '@database/postgres/PostgresWorkspaceDatabase';

export class Databases {
  readonly document: DocumentRepository;
  readonly resource: ResourceRepository;
  readonly workspace: WorkspaceRepository;

  constructor(document: DocumentRepository) {
    this.document = document;
    this.resource = new PostgresResourceDatabase();
    this.workspace = new PostgresWorkspaceDatabase();
  }
}
