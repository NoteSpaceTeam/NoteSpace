import { ResourceType, WorkspaceResource } from '@notespace/shared/src/workspace/types/resource';

type Workspace = {
    id: string;
    name: string;
    resources: string[];
}

const workspaces = new Map<string, Workspace>();

export const createWorkspace = async (name: string): Promise<string> => {
    const id = Math.random().toString(36).substring(7);
    workspaces.set(id, { id, name, resources: [] });
    return id;
}

export const getWorkspaces = async (): Promise<Workspace[]> => {
    return Array.from(workspaces.values());
}

export const getWorkspace = async (id: string): Promise<Workspace> => {
    const workspace = workspaces.get(id);
    if (!workspace) throw new Error(`Workspace with id ${id} not found`);
    return workspace;
}

export const updateWorkspace = async (id: string, name: string): Promise<void> => {
    const workspace = workspaces.get(id);
    if (!workspace) throw new Error(`Workspace with id ${id} not found`);
    workspaces.set(id, { ...workspace, name });
}

export const deleteWorkspace = async (id: string): Promise<void> => {
    if (!workspaces.delete(id)) throw new Error(`Workspace with id ${id} not found`);
}

export const getWorkspaceResources = async (id: string): Promise<WorkspaceResource[]> => {
    const workspace = workspaces.get(id);
    if (!workspace) throw new Error(`Workspace with id ${id} not found`);
    return workspace.resources.map(id => ({ id,
      name: 'Resource',
      workspace: id,
      type: ResourceType.DOCUMENT,
      parent: id,
      children: [],
    }));
}

export const getWorkspaceResource = async (resourceId: string): Promise<WorkspaceResource> => {
  const workspace = Array.from(workspaces.values()).find(w => w.resources.includes(resourceId));
    if (!workspace) throw new Error(`Resource with id ${resourceId} not found`);
    return {
      id: resourceId,
      name: 'Resource',
      workspace: workspace.id,
      type: ResourceType.DOCUMENT,
      parent: workspace.id,
      children: [],
    };
}

export const addWorkspaceResource = async (wid: string, resourceId: string): Promise<string> => {
    const workspace = workspaces.get(wid);
    if (!workspace) throw new Error(`Workspace with id ${wid} not found`);
    workspace.resources.push(resourceId);
    return Promise.resolve(resourceId);
}

export const updateWorkspaceResource = async (resourceId: string, newProps: Partial<WorkspaceResource>): Promise<void> => {
     const workspace = Array.from(workspaces.values()).find(w => w.resources.includes(resourceId));
      if (!workspace) throw new Error(`Resource with id ${resourceId} not found`);
      const resource = workspace.resources.find(id => id === resourceId);
      if (!resource) throw new Error(`Resource with id ${resourceId} not found`);
      Object.assign(resource, newProps);
}

export const removeWorkspaceResource = async ( resourceId: string): Promise<void> => {
    const workspace = Array.from(workspaces.values()).find(w => w.resources.includes(resourceId));
    if (!workspace) throw new Error(`Resource with id ${resourceId} not found`);
    workspace.resources = workspace.resources.filter(id => id !== resourceId);
}

export const memoryDB = {
    createWorkspace,
    getWorkspaces,
    getWorkspace,
    updateWorkspace,
    deleteWorkspace,
    getWorkspaceResources,
    getWorkspaceResource,
    addWorkspaceResource,
    updateWorkspaceResource,
    removeWorkspaceResource,
};