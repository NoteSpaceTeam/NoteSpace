import { Link } from 'react-router-dom';
import { ResourceType } from '@notespace/shared/src/workspace/types/resource';
import { IoDocumentText } from 'react-icons/io5';
import { FaFolder } from 'react-icons/fa6';
import { WorkspaceTreeNode } from '@domain/workspaces/tree/WorkspaceTree';
import { TreeNode } from '@domain/workspaces/tree/utils';

type ResourceViewProps = {
  workspace: string;
  resource: WorkspaceTreeNode;
  children?: TreeNode[];
};

const ResourceComponents = {
  [ResourceType.DOCUMENT]: ({ workspace, resource }: ResourceViewProps) => (
    <Link to={`/workspaces/${workspace}/${resource.id}`}>
      <IoDocumentText />
      {resource.name || 'Untitled'}
    </Link>
  ),
  [ResourceType.FOLDER]: ({ resource }: ResourceViewProps) => (
    <div>
      <FaFolder />
      {resource.name}
    </div>
  ),
};

function ResourceView({ resource, workspace, children }: ResourceViewProps) {
  const ResourceComponent = ResourceComponents[resource.type];
  return (
    <div
      style={{
        paddingLeft: '1rem',
      }}
    >
      <ResourceComponent workspace={workspace} resource={resource} />
      {children?.map(child => (
        <ResourceView key={child.node.id} workspace={workspace} resource={child.node} children={child.children} />
      ))}
    </div>
  );
}

export default ResourceView;
