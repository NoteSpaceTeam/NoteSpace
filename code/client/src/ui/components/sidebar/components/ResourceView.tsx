import { Link } from 'react-router-dom';
import { ResourceType, WorkspaceResource } from '@notespace/shared/src/workspace/types/resource.ts';
import { IoDocumentText } from 'react-icons/io5';
import { FaFolder } from 'react-icons/fa6';

type ResourceViewProps = {
  resource: WorkspaceResource;
};

const ResourceComponents = {
  [ResourceType.DOCUMENT]: ({ resource }: ResourceViewProps) => (
    <Link to={`/workspaces/${resource.workspace}/${resource.id}`}>
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

function ResourceView({ resource }: ResourceViewProps) {
  const ResourceComponent = ResourceComponents[resource.type];
  return <ResourceComponent resource={resource} />;
}

export default ResourceView;
