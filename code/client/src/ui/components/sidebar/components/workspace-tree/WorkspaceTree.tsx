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

  async function onCreateResource(parent: string, type: ResourceType) {
    await operations.createResource('Untitled', type, parent);
  }

  async function onDrag(e: DragEvent<HTMLDivElement>) {
    setDragId(e.currentTarget.id);
  }

  async function onDrop(e: DragEvent<HTMLDivElement>) {
    if (!dragId) return;
    const parentId = e.currentTarget.id || workspace.id;
    await operations.moveResource(dragId, parentId);
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
