import { ResourceType, WorkspaceResource } from '@notespace/shared/src/workspace/types/resource';
import { ResourcesRepository } from '@databases/types';
import { InvalidParameterError, NotFoundError } from '@domain/errors/errors';
import sql from '@databases/resources/postgres/config';
import { isEmpty } from 'lodash';

export class PSQLResourcesDB implements ResourcesRepository {

  async createResource(wid: string, name: string, type: ResourceType, parent?: string): Promise<string> {
    const resource = { workspace: wid, name, type, parent: parent };
    const results = await sql`
        INSERT INTO resource ${sql(resource)}
        RETURNING id
    `;
    if (isEmpty(results)) throw new Error('Resource not created');
    return results[0].id;
  }

  async getResource(id: string): Promise<WorkspaceResource> {
    const results: WorkspaceResource[] = await sql`
        SELECT * FROM resource WHERE id = ${id}
    `;
    if (isEmpty(results)) throw new NotFoundError('Resource not found');
    return results[0];
  }

  async updateResource(id: string, resource: Partial<WorkspaceResource>): Promise<void> {
    if (!resource.id) throw new InvalidParameterError('Resource id not provided');
    const results = await sql`
        UPDATE resource
        SET ${sql(resource)}
        WHERE id = ${id}
    `;
    if (isEmpty(results)) throw new Error('Resource not updated');
  }

  async deleteResource(id: string) {
    const results = await sql`
        DELETE FROM resource
        WHERE id = ${id}
    `;
    if (isEmpty(results)) throw new Error('Resource not deleted');
  }
}