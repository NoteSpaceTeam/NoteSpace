import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Resource, ResourceType } from '@notespace/shared/src/workspace/types/resource';
import { FaFile, FaFolder } from 'react-icons/fa6';
import { TreeNode } from '@domain/workspaces/tree/types';
import { PiDotOutlineFill } from 'react-icons/pi';
import { RiArrowDownSFill, RiArrowRightSFill } from 'react-icons/ri';
import { FaPlusSquare } from 'react-icons/fa';
import CreateResourceContextMenu from '@ui/components/sidebar/components/CreateResourceContextMenu';

type TreeResourceViewProps = {
  workspace: string;
  resource: Resource;
  onCreateResource?: (parent: string, type: ResourceType) => void;
  onDrag?: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop?: (e: React.DragEvent<HTMLDivElement>) => void;
  children?: TreeNode[];
};

function TreeResourceView({ resource, workspace, children, onCreateResource, onDrag, onDrop }: TreeResourceViewProps) {
  const [isOpen, setIsOpen] = useState(true);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const props: React.HTMLProps<HTMLDivElement> = {
    id: resource.id,
    draggable: true,
    onDragOver: (e: React.DragEvent) => e.preventDefault(),
    onDragStart: onDrag,
    onDrop: onDrop,
  };

  return (
    <div className="resource">
      <div className="resource-header">
        <div>
          <div>
            {resource.children.length > 0 ? (
              <button onClick={handleToggle}>{isOpen ? <RiArrowDownSFill /> : <RiArrowRightSFill />}</button>
            ) : (
              <PiDotOutlineFill />
            )}
          </div>

          <CreateResourceContextMenu
            onCreateNew={(type: ResourceType) => onCreateResource!(resource.id, type)}
            trigger={'create-new-resource-' + resource.id}
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
        <button id={'create-new-resource-' + resource.id}>
          <FaPlusSquare />
        </button>
      </div>
      <div className="resource-children">
        {isOpen &&
          children?.map(child => (
            <TreeResourceView
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

export default TreeResourceView;
