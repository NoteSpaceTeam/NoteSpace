import { Link } from 'react-router-dom';
import { ResourceType } from '@notespace/shared/src/workspace/types/resource';
import { IoDocumentText } from 'react-icons/io5';
import { FaFolder } from 'react-icons/fa6';
import { TreeNode, WorkspaceTreeNode } from '@domain/workspaces/tree/types';
import { useState } from 'react';
import { RiArrowDownSFill, RiArrowRightSFill } from 'react-icons/ri';
import { FaPlusSquare } from 'react-icons/fa';

type ResourceViewProps = {
  workspace: string;
  resource: WorkspaceTreeNode;
  onCreateResource: (parent?: string) => void;
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

function ResourceView({ resource, workspace, children, onCreateResource }: ResourceViewProps) {
  const [isOpen, setIsOpen] = useState(true);
  const ResourceComponent = ResourceComponents[resource.type];

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="resource">
      <div className="resource-header">
        <div>
          <button onClick={handleToggle}>{isOpen ? <RiArrowDownSFill /> : <RiArrowRightSFill />}</button>
          <ResourceComponent workspace={workspace} resource={resource} onCreateResource={onCreateResource} />
        </div>
        <button onClick={() => onCreateResource(resource.id)}>
          <FaPlusSquare />
        </button>
      </div>
      <div className="resource-children">
        {isOpen &&
          children?.map(child => (
            <ResourceView
              key={child.node.id}
              workspace={workspace}
              resource={child.node}
              children={child.children}
              onCreateResource={onCreateResource}
            />
          ))}
      </div>
    </div>
  );
}

export default ResourceView;
