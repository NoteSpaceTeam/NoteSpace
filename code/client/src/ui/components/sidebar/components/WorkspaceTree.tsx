import ResourceView from '@ui/components/sidebar/components/ResourceView';
import { WorkspaceMetaData } from '@notespace/shared/src/workspace/types/workspace';
import { getTree } from '@domain/workspaces/tree/utils';
import { WorkspaceTreeNodes } from '@domain/workspaces/tree/types';

type WorkspaceTreeProps = {
  workspace: WorkspaceMetaData;
  nodes?: WorkspaceTreeNodes;
};

function WorkspaceTree({ workspace, nodes }: WorkspaceTreeProps) {
  if (!nodes) return null;
  return (
    <ul>
      {getTree(nodes).children.map(node => (
        <li key={node.node.id}>
          <ResourceView workspace={workspace.id} resource={node.node} children={node.children} />
        </li>
      ))}
    </ul>
  );
}
export default WorkspaceTree;
