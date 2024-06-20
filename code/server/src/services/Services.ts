import { ResourcesService } from '@services/ResourcesService';
import { WorkspacesService } from '@services/WorkspacesService';
import { Databases } from '@databases/types';
import { DocumentsService } from '@services/DocumentsService';
import { UsersService } from '@services/UsersService';

export class Services {
  readonly resources: ResourcesService;
  readonly workspaces: WorkspacesService;
  readonly documents: DocumentsService;
  readonly users: UsersService;

  constructor(databases: Databases) {
    this.resources = new ResourcesService(databases);
    this.workspaces = new WorkspacesService(databases);
    this.documents = new DocumentsService(databases);
    this.users = new UsersService(databases);
  }
}
