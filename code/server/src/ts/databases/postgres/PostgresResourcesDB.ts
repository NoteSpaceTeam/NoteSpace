import { ResourceType, WorkspaceResource } from '@notespace/shared/src/workspace/types/resource';
import { ResourcesRepository } from '@databases/types';
import { NotFoundError } from '@domain/errors/errors';
import { isEmpty } from 'lodash';
import sql from '@databases/postgres/config';

export class PostgresResourcesDB implements ResourcesRepository {
  async createResource(wid: string, name: string, type: ResourceType, parent?: string): Promise<string> {
    const resource = { workspace: wid, name, parent: parent || wid, type };
    console.log('resource', resource);
    const results = await sql`
        insert into resource ${sql(resource)}
        returning id
    `;
    if (isEmpty(results)) throw new Error('Resource not created');
    return results[0].id;
  }

  async getResource(id: string): Promise<WorkspaceResource> {
    const results: WorkspaceResource[] = await sql`
        select * from resource where id = ${id}
    `;
    if (isEmpty(results)) throw new NotFoundError('Resource not found');
    return results[0];
  }

  async updateResource(id: string, resource: Partial<WorkspaceResource>): Promise<void> {
    const results = await sql`
        update resource
        set ${sql(resource)}
        where id = ${id}
        returning id
    `;
    if (isEmpty(results)) throw new NotFoundError('Resource not found');
  }

  async deleteResource(id: string) {
    const results = await sql`
        delete from resource
        where id = ${id}
        returning id
    `;
    if (isEmpty(results)) throw new NotFoundError('Resource not found');
  }
}
