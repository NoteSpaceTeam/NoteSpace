import { ResourceType, Resource } from '@notespace/shared/src/workspace/types/resource';
import { ResourcesRepository } from '@databases/types';
import { NotFoundError } from '@domain/errors/errors';
import { isEmpty } from 'lodash';
import sql from '@databases/postgres/config';

export class PostgresResourcesDB implements ResourcesRepository {
  async createResource(wid: string, name: string, type: ResourceType, parent?: string): Promise<string> {
    const resource = {
      workspace: wid,
      parent: parent || wid,
      name,
      type,
    };

    const results = await sql`
        insert into resource ${sql(resource)} 
        returning id
    `;

    if (isEmpty(results)) throw new Error('Resource not created');
    return results[0].id;
  }

  async getResource(id: string): Promise<Resource> {
    const results: Resource[] = await sql`select *from resource where id = ${id}`;

    if (isEmpty(results)) throw new NotFoundError('Resource not found');
    return results[0];
  }

  async updateResource(id: string, resource: Partial<Resource>): Promise<void> {
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

  async getResources(wid: string): Promise<Resource[]> {
    return (
      await sql`
          select row_to_json(t) as resources
          from(
                  select id, name, type, parent, children
                  from resource
                  where workspace = ${wid}
                  group by id
                  order by created_at desc
              ) as t
      `
    ).map(r => r.resources);
  }
}
