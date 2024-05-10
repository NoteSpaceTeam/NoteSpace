import { ResourcesService } from '@services/ResourcesService';
import { WorkspaceService } from '@services/WorkspaceService';
import { Databases } from '@database/Databases';

export class Services {
  private readonly databases: Databases;

  readonly resources: ResourcesService;
  readonly workspace: WorkspaceService;

  constructor(databases: Databases) {
    this.databases = databases;
    this.resources = new ResourcesService(this.databases.resource, this.databases.document);
    this.workspace = new WorkspaceService(this.databases.workspace);
  }
}
