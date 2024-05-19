import ResourceView from '@ui/components/sidebar/components/ResourceView';
import { WorkspaceMetaData } from '@notespace/shared/src/workspace/types/workspace';
import { getTree } from '@domain/workspaces/tree/utils';
import { WorkspaceTreeNodes } from '@domain/workspaces/tree/types';
import { ResourceOperationsType } from '@ui/contexts/workspace/WorkspaceContext';
import { ResourceType } from '@notespace/shared/src/workspace/types/resource';
import { DragEvent, useEffect, useState } from 'react';
import CreateResourcePopup from '@ui/components/sidebar/components/CreateResourcePopup';

type WorkspaceTreeProps = {
  workspace: WorkspaceMetaData;
  operations: ResourceOperationsType;
  nodes?: WorkspaceTreeNodes;
};

function WorkspaceTree({ workspace, nodes, operations }: WorkspaceTreeProps) {
  const [dragId, setDragId] = useState<string | null>(null);
  const [parent, setParent] = useState<string | null>(null);
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const popupElement = document.querySelector('.popup');
      if (popupElement && !popupElement.contains(event.target as Node)) {
        setPopupOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  async function onCreateResource(parent: string, type: ResourceType) {
    setPopupOpen(false);
    setParent(null);
    await operations.createResource('Untitled', type, parent);
  }

  function onCreateNew(parent: string, position: { top: number; left: number }) {
    setParent(parent || null);
    setPopupOpen(true);
    setPopupPosition(position);
  }

  async function onDrag(e: DragEvent<HTMLDivElement>) {
    setDragId(e.currentTarget.id);
  }

  async function onDrop(e: DragEvent<HTMLDivElement>) {
    if (!dragId) return;
    const parentId = e.currentTarget.id || 'root';
    await operations.moveResource(dragId, parentId);
  }

  return (
    <div className="workspace-tree">
      <ul>
        {nodes &&
          getTree(nodes).children.map(node => (
            <li key={node.node.id}>
              <ResourceView
                workspace={workspace.id}
                resource={node.node}
                children={node.children}
                onCreateNew={onCreateNew}
                onDrag={onDrag}
                onDrop={onDrop}
              />
            </li>
          ))}
      </ul>
      {popupOpen && (
        <CreateResourcePopup position={popupPosition} onCreate={type => onCreateResource(parent || 'root', type)} />
      )}
    </div>
  );
}
export default WorkspaceTree;
