import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Resource, ResourceType } from '@notespace/shared/src/workspace/types/resource';
import { FaFile, FaFolder } from 'react-icons/fa6';
import { TreeNode } from '@domain/workspaces/tree/types';
import { RiArrowDownSFill, RiArrowRightSFill } from 'react-icons/ri';
import CreateResourceMenu from '@ui/components/sidebar/components/CreateResourceMenu';
import { GoPlus } from 'react-icons/go';
import ResourceContextMenu from '@ui/pages/workspace/components/ResourceContextMenu';
import useEditing from '@ui/hooks/useEditing';
import useWorkspace from '@/contexts/workspace/useWorkspace';

type TreeResourceViewProps = {
  workspace: string;
  resource: Resource;
  onCreateResource?: (parent: string, type: ResourceType) => void;
  onDeleteResource?: (id: string) => void;
  onRenameResource?: (id: string, name: string) => void;
  onDuplicateResource?: (id: string, name: string, type: ResourceType) => void;
  onOpenInNewTab?: (id: string) => void;
  onDrag?: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop?: (e: React.DragEvent<HTMLDivElement>) => void;
  children?: TreeNode[];
};

function TreeResourceView({
  resource,
  workspace,
  children,
  onCreateResource,
  onDeleteResource,
  onRenameResource,
  onDuplicateResource,
  onOpenInNewTab,
  onDrag,
  onDrop,
}: TreeResourceViewProps) {
  const { isMember } = useWorkspace();
  const [isOpen, setIsOpen] = useState(true);
  const { component, isEditing, setIsEditing } = useEditing(resource.name || 'Untitled', isMember, (name: string) =>
    onRenameResource!(resource.id, name)
  );

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const props: React.HTMLProps<HTMLDivElement> = {
    id: resource.id,
    draggable: isMember,
    onDragOver: (e: React.DragEvent) => e.preventDefault(),
    onDragStart: onDrag,
    onDrop: onDrop,
  };

  return (
    <div className="resource">
      <div className="resource-header">
        <ResourceContextMenu
          onRename={() => setIsEditing(true)}
          onDelete={() => onDeleteResource!(resource.id)}
          onDuplicate={() => onDuplicateResource!(resource.parent, resource.name, resource.type)}
          onOpenInNewTab={resource.type === ResourceType.DOCUMENT ? () => onOpenInNewTab!(resource.id) : undefined}
          enabled={isMember}
        >
          <div className="expand-icon">
            <button className={resource.children.length === 0 ? 'hide-button' : ''} onClick={handleToggle}>
              {isOpen ? <RiArrowDownSFill /> : <RiArrowRightSFill />}
            </button>
          </div>
          <CreateResourceMenu
            onCreateNew={(type: ResourceType) => onCreateResource!(resource.id, type)}
            trigger={'create-new-resource-' + resource.id}
            enabled={isMember}
          />
          {resource.type === ResourceType.DOCUMENT ? (
            <div {...props} className="resource-name document-resource">
              {isEditing ? (
                <div>
                  <FaFile />
                  {component}
                </div>
              ) : (
                <Link to={`/workspaces/${workspace}/${resource.id}`}>
                  <FaFile />
                  {component}
                </Link>
              )}
            </div>
          ) : (
            <div {...props} className="resource-name folder-resource">
              <div>
                <FaFolder />
                {component}
              </div>
            </div>
          )}
        </ResourceContextMenu>
        {!isEditing && isMember && (
          <button id={'create-new-resource-' + resource.id}>
            <GoPlus />
          </button>
        )}
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
              onDeleteResource={onDeleteResource}
              onRenameResource={onRenameResource}
              onDuplicateResource={onDuplicateResource}
              onOpenInNewTab={onOpenInNewTab}
              onDrag={onDrag}
              onDrop={onDrop}
            />
          ))}
      </div>
    </div>
  );
}

export default TreeResourceView;
