import { ResourceType, WorkspaceResource } from '@notespace/shared/src/workspace/types/resource';
import useResourceService from '@services/resource/useResourceService';
import useSocketListeners from '@services/communication/socket/useSocketListeners';
import { useCommunication } from '@ui/contexts/communication/useCommunication';
import { useState } from 'react';
import useWorkspaceTree from '@domain/workspaces/tree/useWorkspaceTree';
import { WorkspaceTreeNodes } from '@domain/workspaces/tree/types';

export type UseResourcesType = {
  resources: WorkspaceTreeNodes;
  tree: ReturnType<typeof useWorkspaceTree>;
  operations: {
    setResources: (resources: WorkspaceTreeNodes) => void;
    createResource: (name: string, type: ResourceType, parent?: string) => Promise<void>;
    deleteResource: (id: string) => Promise<void>;
    updateResource: (id: string, newProps: Partial<WorkspaceResource>) => Promise<void>;
    moveResource: (id: string, parent: string) => Promise<void>;
  };
};

function useResources(): UseResourcesType {
  const service = useResourceService();
  const { socket } = useCommunication();
  const [resources, setResources] = useState<WorkspaceTreeNodes>({});
  const tree = useWorkspaceTree();

  function onSetResources(resources: WorkspaceTreeNodes) {
    setResources(resources);
    tree.setTree(resources);
  }

  function onCreateResource(resource: WorkspaceResource) {
    setResources({ ...resources, [resource.id]: resource });
    tree.addNode(resource);
  }

  async function createResource(name: string, type: ResourceType, parent?: string) {
    await service.createResource(name, type, parent);
  }

  function onDeleteResource(id: string) {
    const getChildren = (id: string): string[] => {
      const resource = tree.getNode(id);
      if (!resource) return [];
      return [id, ...resource.children.flatMap(childId => getChildren(childId))];
    };
    const idsToRemove = getChildren(id);
    const newResources = { ...resources };
    idsToRemove.forEach(id => delete newResources[id]);
    setResources(newResources);
    tree.removeNode(id);
  }

  async function deleteResource(id: string) {
    await service.deleteResource(id);
  }

  function onUpdateResource(resource: Partial<WorkspaceResource>) {
    if (!resource.id) throw new Error('Resource id is required');
    setResources({ ...resources, [resource.id]: { ...resources[resource.id], ...resource } });
    if (resource.name) tree.updateNode(resource.id, resource.name);
    if (resource.parent) tree.moveNode(resource.id, resource.parent);
  }

  async function updateResource(id: string, newProps: Partial<WorkspaceResource>) {
    await service.updateResource(id, newProps);
  }

  async function moveResource(id: string, parent: string) {
    if (id === parent || tree.isDescendant(parent, id)) return;
    await service.updateResource(id, { parent });
  }

  useSocketListeners(socket, {
    createdResource: onCreateResource,
    deletedResource: onDeleteResource,
    updatedResource: onUpdateResource,
  });

  return {
    resources,
    tree,
    operations: {
      setResources: onSetResources,
      createResource,
      deleteResource,
      updateResource,
      moveResource,
    },
  };
}

export default useResources;
