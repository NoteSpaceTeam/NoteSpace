import { Link } from 'react-router-dom';
import { ResourceType } from '@notespace/shared/src/workspace/types/resource';
import { FaFile, FaFolder } from 'react-icons/fa6';
import { TreeNode, WorkspaceTreeNode } from '@domain/workspaces/tree/types';
import React, { useState } from 'react';
import { RiArrowDownSFill, RiArrowRightSFill } from 'react-icons/ri';
import { FaPlusSquare } from 'react-icons/fa';
import CreateResourceContextMenu from '@ui/components/sidebar/components/CreateResourceContextMenu';

type ResourceViewProps = {
  workspace: string;
  resource: WorkspaceTreeNode;
  onCreateResource?: (parent: string, type: ResourceType) => void;
  onDrag?: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop?: (e: React.DragEvent<HTMLDivElement>) => void;
  children?: TreeNode[];
};

function ResourceView({ resource, workspace, children, onCreateResource, onDrag, onDrop }: ResourceViewProps) {
  const [isOpen, setIsOpen] = useState(true);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const props: React.HTMLProps<HTMLDivElement> = {
    draggable: true,
    onDragOver: (e: React.DragEvent) => e.preventDefault(),
    onDragStart: onDrag,
    onDrop,
  };

  return (
    <div className="resource">
      <div className="resource-header">
        <div>
          <button onClick={handleToggle}>{isOpen ? <RiArrowDownSFill /> : <RiArrowRightSFill />}</button>
          <CreateResourceContextMenu
            onCreateNew={(type: ResourceType) => onCreateResource!(resource.id, type)}
            trigger="create-new-resource"
          >
            {resource.type === ResourceType.DOCUMENT ? (
              <div {...props}>
                <Link to={`/workspaces/${workspace}/${resource.id}`} className="resource-name document">
                  <FaFile />
                  {resource.name}
                </Link>
              </div>
            ) : (
              <div {...props} className="resource-name folder">
                <FaFolder />
                {resource.name}
              </div>
            )}
          </CreateResourceContextMenu>
        </div>
        <button className="create-new-resource">
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
              onDrag={onDrag}
              onDrop={onDrop}
            />
          ))}
      </div>
    </div>
  );
}

export default ResourceView;
