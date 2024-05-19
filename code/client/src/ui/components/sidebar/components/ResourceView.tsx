import { Link } from 'react-router-dom';
import { ResourceType } from '@notespace/shared/src/workspace/types/resource';
import { FaFile, FaFolder } from 'react-icons/fa6';
import { TreeNode, WorkspaceTreeNode } from '@domain/workspaces/tree/types';
import { useState } from 'react';
import { RiArrowDownSFill, RiArrowRightSFill } from 'react-icons/ri';
import { FaPlusSquare } from 'react-icons/fa';
import { DragEvent, MouseEvent } from 'react';

type ResourceViewProps = {
  workspace: string;
  resource: WorkspaceTreeNode;
  onCreateNew?: (parent: string, position: { top: number; left: number }) => void;
  onDrag?: (e: DragEvent<HTMLDivElement>) => void;
  onDrop?: (e: DragEvent<HTMLDivElement>) => void;
  children?: TreeNode[];
};

type ResourceComponentProps = ResourceViewProps;

const ResourceComponents = {
  [ResourceType.DOCUMENT]: (props: ResourceComponentProps) => {
    const { resource, workspace, ...rest } = props;
    return (
      <div {...rest}>
        <Link to={`/workspaces/${workspace}/${resource.id}`} className="resource-name">
          <FaFile />
          {resource.name || 'Untitled'}
        </Link>
      </div>
    );
  },
  [ResourceType.FOLDER]: (props: ResourceComponentProps) => {
    const { resource, ...rest } = props;
    return (
      <div {...rest} className="resource-name">
        <FaFolder />
        {resource.name}
      </div>
    );
  },
};

function ResourceView({ resource, workspace, children, onCreateNew, onDrag, onDrop }: ResourceViewProps) {
  const [isOpen, setIsOpen] = useState(true);
  const ResourceComponent = ResourceComponents[resource.type];

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleCreateNew = (e: MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const { top, left } = e.currentTarget.getBoundingClientRect();
    onCreateNew!(resource.id, { top, left });
  };

  return (
    <div className="resource">
      <div className="resource-header">
        <div>
          <button onClick={handleToggle}>{isOpen ? <RiArrowDownSFill /> : <RiArrowRightSFill />}</button>
          <ResourceComponent
            id={resource.id}
            workspace={workspace}
            resource={resource}
            draggable={true}
            onDragOver={(e: DragEvent) => e.preventDefault()}
            onDragStart={onDrag}
            onDrop={onDrop}
          />
        </div>
        <button onClick={handleCreateNew}>
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
              onCreateNew={onCreateNew}
              onDrag={onDrag}
              onDrop={onDrop}
            />
          ))}
      </div>
    </div>
  );
}

export default ResourceView;
