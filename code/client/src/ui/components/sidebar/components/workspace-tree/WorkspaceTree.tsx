import TreeResourceView from '@ui/components/sidebar/components/workspace-tree/TreeResourceView';
import { WorkspaceMeta } from '@notespace/shared/src/workspace/types/workspace';
import { getTree } from '@domain/workspaces/tree/utils';
import { ResourceType } from '@notespace/shared/src/workspace/types/resource';
import { DragEvent, useState } from 'react';
import { Resources, WorkspaceOperations } from '@ui/contexts/workspace/WorkspaceContext';
import './WorkspaceTree.scss';

type WorkspaceTreeProps = {
  workspace: WorkspaceMeta;
  resources: Resources;
  operations: WorkspaceOperations;
};

function WorkspaceTree({ workspace, resources, operations }: WorkspaceTreeProps) {
  const [dragId, setDragId] = useState<string | null>(null);

  async function onDrag(e: DragEvent<HTMLDivElement>) {
    setDragId(e.currentTarget.id);
  }

  async function onDrop(e: DragEvent<HTMLDivElement>) {
    if (!dragId) return;
    const parentId = e.currentTarget.id || workspace.id;
    await operations.moveResource(dragId, parentId);
  }

  async function onCreateResource(parent: string, type: ResourceType) {
    await operations.createResource('Untitled', type, parent);
  }

  async function onDeleteResource(id: string) {
    await operations.deleteResource(id);
  }

  async function onRenameResource(id: string, name: string) {
    await operations.updateResource(id, { name });
  }

  async function onDuplicateResource(parent: string, name: string, type: ResourceType) {
    await operations.createResource(name, type, parent);
  }

  async function onOpenInNewTab(id: string) {
    window.open(`/workspaces/${workspace.id}/${id}`);
  }

  return (
    <div className="workspace-tree">
      <ul>
        {resources[workspace.id] &&
          getTree(workspace.id, resources).children.map(node => (
            <li key={node.node.id}>
              <TreeResourceView
                workspace={workspace.id}
                resource={node.node}
                children={node.children}
                onCreateResource={onCreateResource}
                onDeleteResource={onDeleteResource}
                onRenameResource={onRenameResource}
                onDuplicateResource={onDuplicateResource}
                onOpenInNewTab={onOpenInNewTab}
                onDrag={onDrag}
                onDrop={onDrop}
              />
            </li>
          ))}
      </ul>
    </div>
  );
}
export default WorkspaceTree;
