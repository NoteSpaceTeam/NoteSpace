import ResourceView from '@ui/components/sidebar/components/ResourceView';
import { WorkspaceMetaData } from '@notespace/shared/src/workspace/types/workspace';
import { getTree } from '@domain/workspaces/tree/utils';
import { WorkspaceTreeNodes } from '@domain/workspaces/tree/types';
import { ResourceOperationsType } from '@ui/contexts/workspace/WorkspaceContext';
import { ResourceType } from '@notespace/shared/src/workspace/types/resource';
import { DragEvent, useState } from 'react';

type WorkspaceTreeProps = {
  workspace: WorkspaceMetaData;
  operations: ResourceOperationsType;
  nodes?: WorkspaceTreeNodes;
};

function WorkspaceTree({ workspace, nodes, operations }: WorkspaceTreeProps) {
  const [dragId, setDragId] = useState<string | null>(null);

  async function onCreateResource(parent: string, type: ResourceType) {
    await operations.createResource('Untitled', type, parent);
  }

  async function onDrag(e: DragEvent<HTMLDivElement>) {
    setDragId(e.currentTarget.id);
  }

  async function onDrop(e: DragEvent<HTMLDivElement>) {
    if (!dragId) return;
    const parentId = e.currentTarget.id || 'root';
    await operations.moveResource(dragId, parentId);
  }

  return (
    <div className="workspace-tree">
      <ul>
        {nodes &&
          getTree(nodes).children.map(node => (
            <li key={node.node.id}>
              <ResourceView
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
