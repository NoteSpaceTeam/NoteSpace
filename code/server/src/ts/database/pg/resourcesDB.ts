import sql from '@database/pg/sql';
import { ResourceInputModel, WorkspaceResource } from '../../../../../shared/workspace/resource';
import { ResourceDatabase } from '@database/types';

export class ResourcesDB implements ResourceDatabase{


    async createResource(resource : ResourceInputModel) : Promise<string> {
        const results = await sql`
            INSERT INTO resource ${sql(resource)}
            RETURNING id
        `;
        if (results.length === 0) throw new Error('Resource not created');
        return results[0].id;
    }

    async getResource(id : string) : Promise<WorkspaceResource> {
        const results : WorkspaceResource[] = await sql`
            SELECT * FROM resource WHERE id = ${id}
        `;
        if (results.length === 0) throw new Error('Resource not found');
        if (results.length > 1) throw new Error('Multiple resources found');
        return results[0];
    }

    async updateResource(resource : Partial<WorkspaceResource>) : Promise<void> {
        if (!resource.id) throw new Error('Resource id not provided');

        const results = await sql`
            UPDATE resource
            SET ${sql(resource)}
            WHERE id = ${resource.id}
        `;
        if (results.length === 0) throw new Error('Resource not updated');
    }

    async deleteResource(id : string) {
        const results = await sql`
            DELETE FROM resource
            WHERE id = ${id}
        `;
        if (results.length === 0) throw new Error('Resource not deleted');
    }
}