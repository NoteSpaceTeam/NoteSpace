import { WorkspaceDatabase } from '@database/types';
import { WorkspaceResource } from '@notespace/shared/workspace/types/resource';

import sql from './database';

// export default function PostgresDB() : WorkspaceDatabase {
//   async function getWorkspaceResources(workspace: string) : Promise<WorkspaceResource[]> {
//     return sql`
//         SELECT *
//         FROM resource
//         WHERE workspace = ${workspace}
//     `;
//   }
//
//   async function createResource(resource : WorkspaceResource) : Promise<string> {
//   }
//
//   async function getResource(id : string) : Promise<WorkspaceResource>  {
//   }
//
//   async function updateResource(id : string, newProps : Partial<WorkspaceResource>) {
//   }
//
//   async function deleteResource(id : string) {
//   }
//
//   return {
//     getWorkspaceResources,
//     createResource,
//     getResource,
//     updateResource,
//     deleteResource,
//   };
// }
