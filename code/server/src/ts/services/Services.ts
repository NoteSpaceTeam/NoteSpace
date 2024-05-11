import { ResourcesService } from '@services/ResourcesService';
import { WorkspacesService } from '@services/WorkspacesService';
import { Databases } from '@databases/types';

export class Services {
  private readonly databases: Databases;

  readonly resources: ResourcesService;
  readonly workspace: WorkspacesService;

  constructor(databases: Databases) {
    this.databases = databases;
    this.resources = new ResourcesService(this.databases.resource, this.databases.document);
    this.workspace = new WorkspacesService(this.databases.workspace, this.databases.document);
  }
}
