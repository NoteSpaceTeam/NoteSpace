import {
  ResourceType,
  WorkspaceResource,
  WorkspaceResourceMetadata,
} from '@notespace/shared/src/workspace/types/resource';
import useResourceService from '@services/resource/useResourceService';
import useSocketListeners from '@services/communication/socket/useSocketListeners';
import { useCommunication } from '@ui/contexts/communication/useCommunication';
import { useState } from 'react';
import useWorkspaceTree from '@domain/workspaces/tree/useWorkspaceTree';

function useResources() {
  const service = useResourceService();
  const { socket } = useCommunication();
  const [resources, setResources] = useState<WorkspaceResource[]>([]);
  const tree = useWorkspaceTree();

  function onCreateResource(resource: WorkspaceResource) {
    setResources([...resources, resource]);
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
    setResources(resources.filter(resource => !idsToRemove.includes(resource.id)));
    tree.removeNode(id);
  }

  async function deleteResource(id: string) {
    await service.deleteResource(id);
  }

  function onUpdateResource(resource: Partial<WorkspaceResourceMetadata>) {
    if (!resource.id) throw new Error('Resource id is required');
    setResources(resources.map(res => (res.id === resource.id ? { ...res, ...resource } : res)));
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
    setResources,
    tree,
    operations: {
      createResource,
      deleteResource,
      updateResource,
      moveResource,
    },
  };
}

export default useResources;
