import { ResourcesService } from '@services/ResourcesService';
import { WorkspacesService } from '@services/WorkspacesService';
import { Databases } from '@databases/types';
import { DocumentsService } from '@services/DocumentsService';

export class Services {
  private readonly databases: Databases;

  readonly resources: ResourcesService;
  readonly workspace: WorkspacesService;
  readonly documents: DocumentsService;

  constructor(databases: Databases) {
    this.databases = databases;
    this.resources = new ResourcesService(this.databases.resource, this.databases.document);
    this.workspace = new WorkspacesService(this.databases.workspace, this.databases.document);
    this.documents = new DocumentsService(this.databases.document);
  }
}
