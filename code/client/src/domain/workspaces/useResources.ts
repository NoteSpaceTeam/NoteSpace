import { ResourceType, Resource } from '@notespace/shared/src/workspace/types/resource';
import useResourceService from '@services/resource/useResourceService';
import useSocketListeners from '@services/communication/socket/useSocketListeners';
import { useCommunication } from '@ui/contexts/communication/useCommunication';
import useWorkspaceTree from '@domain/workspaces/tree/useWorkspaceTree';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import useError from '@ui/contexts/error/useError';

function useResources() {
  const service = useResourceService();
  const { socket } = useCommunication();
  const tree = useWorkspaceTree();
  const { wid } = useParams();
  const [documentId, setDocumentId] = useState<string>();
  const navigate = useNavigate();
  const { publishError } = useError();

  // this is wrong, TODO: fix this
  useEffect(() => {
    const id = window.location.href.split('/').pop();
    console.log(id);
    setDocumentId(id);
  }, []);

  function setResources(resources: Resource[]) {
    tree.setTree(resources);
  }

  function onCreateResource(resource: Resource) {
    tree.addNode(resource);
  }

  async function createResource(name: string, type: ResourceType, parent?: string) {
    await service.createResource(name, type, parent);
  }

  function onDeleteResource(id: string) {
    tree.removeNode(id);
    if (documentId === id) {
      navigate(`/workspaces/${wid}`);
      publishError(Error('Document was deleted'));
    }
  }

  async function deleteResource(id: string) {
    await service.deleteResource(id);
  }

  function onUpdateResource(resource: Partial<Resource>) {
    if (!resource.id) throw new Error('Resource id is required');
    if (resource.name) tree.updateNode(resource.id, resource.name);
    if (resource.parent) tree.moveNode(resource.id, resource.parent);
  }

  async function updateResource(id: string, newProps: Partial<Resource>) {
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
    resources: tree.nodes,
    operations: {
      setResources,
      createResource,
      deleteResource,
      updateResource,
      moveResource,
    },
  };
}

export default useResources;
