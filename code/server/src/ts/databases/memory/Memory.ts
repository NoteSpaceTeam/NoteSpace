import { ResourceType, Resource } from '@notespace/shared/src/workspace/types/resource';
import { v4 as uuid } from 'uuid';
import { NotFoundError } from '@domain/errors/errors';
import { Workspace, WorkspaceMeta } from '@notespace/shared/src/workspace/types/workspace';

type WorkspaceStorage = {
  id: string;
  name: string;
  isPrivate: boolean;
  createdAt: string;
  members: string[];
  resources: Record<string, Resource>;
};

const workspaces: Record<string, WorkspaceStorage> = {};

export function createWorkspace(name: string, isPrivate: boolean): string {
  const id = uuid();
  const root: Resource = {
    id,
    name: 'root',
    workspace: id,
    type: ResourceType.FOLDER,
    parent: '',
    children: [],
    createdAt: '',
    updatedAt: '',
  };
  const now = new Date().toISOString();
  workspaces[id] = { id, name, isPrivate, resources: { [id]: root }, createdAt: now, members: [] };
  return id;
}

export function getWorkspaces(): WorkspaceMeta[] {
  return Object.values(workspaces).map(props => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { resources, ...meta } = props;
    return meta;
  });
}

export function getWorkspace(id: string): Workspace {
  const workspace = workspaces[id];
  if (!workspace) throw new NotFoundError(`Workspace not found`);
  const resources = Object.values(workspace.resources);
  return { ...workspace, resources };
}

export function updateWorkspace(id: string, name: string) {
  const workspace = workspaces[id];
  if (!workspace) throw new NotFoundError(`Workspace not found`);
  workspaces[id] = { ...workspace, name };
}

export function deleteWorkspace(id: string) {
  if (!workspaces[id]) throw new NotFoundError(`Workspace not found`);
  delete workspaces[id];
}

export function createResource(wid: string, name: string, type: ResourceType, parent?: string): string {
  if (!workspaces[wid]) throw new NotFoundError(`Workspace not found`);
  const id = uuid();
  workspaces[wid].resources[id] = {
    id,
    name,
    workspace: wid,
    type,
    parent: parent || wid,
    children: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  // update parent
  if (parent) {
    const parentResource = getResource(parent);
    parentResource.children.push(id);
  }
  return id;
}

export function getResource(id: string): Resource {
  for (const workspace of Object.values(workspaces)) {
    const resource = workspace.resources[id];
    if (resource) return resource;
  }
  throw new NotFoundError(`Resource not found`);
}

export function updateResource(id: string, newProps: Partial<Resource>) {
  const resource = getResource(id);
  Object.assign(resource, newProps);
  if (newProps.parent) {
    const prevParent = getResource(resource.parent);
    prevParent.children = prevParent.children.filter(childId => childId !== id);
    const newParent = getResource(newProps.parent);
    newParent.children.push(id);
  }
}

export function deleteResource(id: string) {
  const resource = getResource(id);

  // if parent not root
  if (resource.workspace !== resource.parent) {
    const parentResource = getResource(resource.parent);
    parentResource.children = parentResource.children.filter(childId => childId !== id);
  }

  // delete children
  for (const childId of resource.children) {
    deleteResource(childId);
  }

  // delete resource
  delete workspaces[resource.workspace].resources[id];
}

export function reset() {
  for (const id of Object.keys(workspaces)) {
    delete workspaces[id];
  }
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
  reset,
};
