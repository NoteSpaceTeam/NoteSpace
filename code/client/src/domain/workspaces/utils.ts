import { WorkspaceMeta } from '@notespace/shared/src/workspace/types/workspace';
import { DocumentResource, ResourceType } from '@notespace/shared/src/workspace/types/resource';
import { Resources } from '@ui/contexts/workspace/WorkspaceContext';

export function sortWorkspaces(workspaces: WorkspaceMeta[], column: string, ascending: boolean): WorkspaceMeta[] {
  return workspaces.sort((a, b) => {
    let comparison = 0;
    switch (column) {
      case 'Name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'Visibility':
        comparison = a.isPrivate === b.isPrivate ? 0 : a.isPrivate ? 1 : -1;
        break;
      case 'Members':
        comparison = a.members.length - b.members.length;
        break;
      case 'Created':
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        break;
      default:
        break;
    }
    return ascending ? comparison : -comparison;
  });
}

export function sortDocuments(documents: DocumentResource[], column: string, ascending: boolean): DocumentResource[] {
  return documents.sort((a, b) => {
    let comparison = 0;
    switch (column) {
      case 'Name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'Created':
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        break;
      case 'Modified':
        comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
        break;
      default:
        break;
    }
    return ascending ? comparison : -comparison;
  });
}

export function getDocuments(resources?: Resources): DocumentResource[] {
  return Object.values(resources || []).filter(
    resource => resource.type === ResourceType.DOCUMENT
  ) as DocumentResource[];
}
