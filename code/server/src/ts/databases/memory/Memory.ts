import { ResourceType, WorkspaceResource } from '@notespace/shared/src/workspace/types/resource';
import { v4 as uuid } from 'uuid';
import { NotFoundError } from '@domain/errors/errors';

type Workspace = {
  id: string;
  name: string;
  resources: WorkspaceResource[];
};

const workspaces = new Map<string, Workspace>();

export function createWorkspace(name: string): string {
  const id = uuid();
  workspaces.set(id, { id, name, resources: [] });
  return id;
}

export function getWorkspaces(): Workspace[] {
  return Array.from(workspaces.values());
}

export function getWorkspace(id: string): Workspace {
  const workspace = workspaces.get(id);
  if (!workspace) throw new NotFoundError(`Workspace not found`);
  return workspace;
}

export function updateWorkspace(id: string, name: string) {
  const workspace = getWorkspace(id);
  workspaces.set(id, { ...workspace, name });
}

export function deleteWorkspace(id: string) {
  if (!workspaces.delete(id)) throw new NotFoundError(`Workspace not found`);
}

export function getResource(id: string): WorkspaceResource {
  const workspace = getResourceWorkspace(id);
  const resource = workspace.resources.find(r => r.id === id);
  if (!resource) throw new NotFoundError(`Resource not found`);
  return resource;
}

export function createResource(wid: string, name: string, type: ResourceType, parent?: string): string {
  const workspace = getWorkspace(wid);
  const id = uuid();
  const resource: WorkspaceResource = {
    id,
    name,
    workspace: wid,
    type,
    parent: parent || wid,
    children: [],
  };
  workspace.resources.push(resource);
  return id;
}

export function updateResource(id: string, newProps: Partial<WorkspaceResource>) {
  const resource = getResource(id);
  Object.assign(resource, newProps);
}

export function deleteResource(id: string) {
  const workspace = getResourceWorkspace(id);
  workspace.resources = workspace.resources.filter(r => r.id !== id);
}

function getResourceWorkspace(resourceId: string): Workspace {
  for (const workspace of workspaces.values()) {
    if (workspace.resources.some(r => r.id === resourceId)) {
      return workspace;
    }
  }
  throw new NotFoundError(`Resource not found`);
}

export const memoryDB = {
  createWorkspace,
  getWorkspaces,
  getWorkspace,
  updateWorkspace,
  deleteWorkspace,
  getResource,
  createResource,
  updateResource,
  deleteResource,
};
