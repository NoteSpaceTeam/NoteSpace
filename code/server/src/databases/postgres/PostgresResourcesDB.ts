import { ResourceType, Resource, DocumentResource } from '@notespace/shared/src/workspace/types/resource';
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
    const results: Resource[] = await sql`
      select *, updated_at as "updatedAt", created_at as "createdAt" 
      from resource 
      where id = ${id}
    `;
    if (isEmpty(results)) throw new NotFoundError('Resource not found');
    return results[0];
  }

  async updateResource(id: string, resource: Partial<Resource>): Promise<void> {
    const { updatedAt, ...rest } = resource;
    const compatible = updatedAt ? { ...rest, updated_at: updatedAt } : rest;
    const results = await sql`
        update resource
        set ${sql(compatible)}
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

  async getRecentDocuments(email: string): Promise<DocumentResource[]> {
    const results = await sql`
        select row_to_json(t) as resource
        from (
          select *, updated_at as "updatedAt", created_at as "createdAt"
          from resource
          where type = 'D' and workspace in (
            select id from workspace where ${email} = any(members)
          )
          order by "updatedAt" desc
          limit 10
        ) as t
    `;
    return results.map(r => r.resource);
  }
}
