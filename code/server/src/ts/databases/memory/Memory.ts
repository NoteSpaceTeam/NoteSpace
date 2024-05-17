import { ResourceType, WorkspaceResource } from '@notespace/shared/src/workspace/types/resource';
import { v4 as uuid } from 'uuid';
import { NotFoundError } from '@domain/errors/errors';
import { Workspace } from '@notespace/shared/src/workspace/types/workspace';

type WorkspaceStorage = {
  id: string;
  name: string;
  resources: Record<string, WorkspaceResource>;
};

const workspaces: Record<string, WorkspaceStorage> = {};

export function createWorkspace(name: string): string {
  const id = uuid();
  const root: WorkspaceResource = {
    id: 'root',
    name: 'root',
    workspace: id,
    type: ResourceType.FOLDER,
    parent: '',
    children: [],
  };
  workspaces[id] = { id, name, resources: { root } };
  return id;
}

export function getWorkspaces(): Workspace[] {
  return Object.values(workspaces).map(({ id, name, resources }) => ({
    id,
    name,
    resources: Object.values(resources),
  }));
}

export function getWorkspace(id: string): Workspace {
  const workspace = workspaces[id];
  if (!workspace) throw new NotFoundError(`Workspace not found`);
  const resources = Object.values(workspace.resources).filter(r => r.id !== 'root');
  return { ...workspace, resources };
}

export function updateWorkspace(id: string, name: string) {
  const workspace = getWorkspace(id);
  workspace.name = name;
}

export function deleteWorkspace(id: string) {
  if (!workspaces[id]) throw new NotFoundError(`Workspace not found`);
  delete workspaces[id];
}

export function getResource(id: string): WorkspaceResource {
  for (const workspace of Object.values(workspaces)) {
    const resource = workspace.resources[id];
    if (resource) return resource;
  }
  throw new NotFoundError(`Resource not found`);
}

export function createResource(wid: string, name: string, type: ResourceType, parent: string): string {
  if (!workspaces[wid]) throw new NotFoundError(`Workspace not found`);
  const id = uuid();
  workspaces[wid].resources[id] = {
    id,
    name,
    workspace: wid,
    type,
    parent,
    children: [],
  };

  // update parent
  const parentResource = getResource(parent);
  parentResource.children.push(id);

  return id;
}

export function updateResource(id: string, newProps: Partial<WorkspaceResource>) {
  const resource = getResource(id);
  Object.assign(resource, newProps);
}

export function deleteResource(id: string) {
  const resource = getResource(id);
  const parentResource = getResource(resource.parent);
  parentResource.children = parentResource.children.filter(childId => childId !== id);

  delete workspaces[resource.workspace].resources[id];
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
