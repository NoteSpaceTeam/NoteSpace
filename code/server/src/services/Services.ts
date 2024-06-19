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
    this.resources = new ResourcesService(databases.resources, databases.documents);
    this.workspaces = new WorkspacesService(databases.workspaces, databases.documents);
    this.documents = new DocumentsService(databases.documents, databases.resources);
    this.users = new UsersService(databases.users);
  }
}
