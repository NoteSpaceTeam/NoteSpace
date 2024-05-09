import { ResourcesDB } from '@database/pg/resourcesDB';
import { ResourceInputModel, WorkspaceResource } from '@notespace/shared/workspace/types/resource';

export class ResourcesService {

  private readonly database: ResourcesDB

  constructor(database: ResourcesDB) {
    this.database = database;
  }

  async createResource(resource: ResourceInputModel): Promise<string> {
    return await this.database.createResource(resource);
  }

  async getResource(id: string): Promise<WorkspaceResource> {
    return await this.database.getResource(id);
  }

  async updateResource(resource: Partial<WorkspaceResource>): Promise<void> {
    await this.database.updateResource(resource);
  }

  async deleteResource(id: string): Promise<void> {
    await this.database.deleteResource(id);
  }

}