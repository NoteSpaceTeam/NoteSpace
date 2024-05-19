import ResourceView from '@ui/components/sidebar/components/ResourceView';
import { WorkspaceMetaData } from '@notespace/shared/src/workspace/types/workspace';
import { getTree } from '@domain/workspaces/tree/utils';
import { WorkspaceTreeNodes } from '@domain/workspaces/tree/types';
import { ResourceOperationsType } from '@ui/contexts/workspace/WorkspaceContext';
import { ResourceType } from '@notespace/shared/src/workspace/types/resource';

type WorkspaceTreeProps = {
  workspace: WorkspaceMetaData;
  operations: ResourceOperationsType;
  nodes?: WorkspaceTreeNodes;
};

function WorkspaceTree({ workspace, nodes, operations }: WorkspaceTreeProps) {
  if (!nodes) return null;

  async function onCreateResource(parent?: string) {
    await operations.createResource('Untitled', ResourceType.DOCUMENT, parent);
  }

  return (
    <ul className="workspace-tree">
      {getTree(nodes).children.map(node => (
        <li key={node.node.id}>
          <ResourceView
            workspace={workspace.id}
            resource={node.node}
            children={node.children}
            onCreateResource={onCreateResource}
          />
        </li>
      ))}
    </ul>
  );
}
export default WorkspaceTree;
