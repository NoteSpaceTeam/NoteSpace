import { WorkspaceTree as Tree } from '@domain/workspaces/tree/WorkspaceTree';
import ResourceView from '@ui/components/sidebar/components/ResourceView';
import { WorkspaceMetaData } from '@notespace/shared/src/workspace/types/workspace';

type WorkspaceTreeProps = {
  workspace: WorkspaceMetaData;
  tree?: Tree;
};

function WorkspaceTree({ workspace, tree }: WorkspaceTreeProps) {
  if (!tree) return null;
  return (
    <ul>
      {Array.from(tree.traverse()).map(([node, children]) => (
        <li key={node.id}>
          <ResourceView workspace={workspace.id} resource={node} children={children} />
        </li>
      ))}
    </ul>
  );
}
export default WorkspaceTree;
