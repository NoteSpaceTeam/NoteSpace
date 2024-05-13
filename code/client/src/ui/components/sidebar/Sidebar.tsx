import { useState } from 'react';
import { IoMenu } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import { RiMenuFold2Line, RiMenuFoldLine } from 'react-icons/ri';
import useWorkspace from '@domain/workspace/useWorkspace.ts';
import useSidebarState from '@ui/components/sidebar/hooks/useSidebarState.ts';
import ResourceView from '@ui/components/sidebar/components/ResourceView.tsx';
import { WorkspaceResource } from '@notespace/shared/src/workspace/types/resource.ts';
import './Sidebar.scss';
import useSocketListeners from '@/services/communication/socket/useSocketListeners.ts';
import { useCommunication } from '@/services/communication/context/useCommunication.ts';

function Sidebar() {
  const { isOpen, isLocked, handleClick, handleMouseEnter, handleMouseLeave } = useSidebarState();
  const { socket } = useCommunication();
  const { workspace } = useWorkspace();
  const [resources, setResources] = useState<WorkspaceResource[]>([]);

  useSocketListeners(socket, {});

  return (
    <div
      className="sidebar"
      style={{ width: isOpen ? '15%' : '0', transition: '0.3s' }}
      onMouseLeave={handleMouseLeave}
    >
      <button onMouseEnter={handleMouseEnter} onClick={handleClick}>
        {isLocked ? (
          <RiMenuFoldLine className="icon" />
        ) : isOpen ? (
          <RiMenuFold2Line className="icon" />
        ) : (
          <IoMenu className="icon-menu" />
        )}
      </button>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>Recent</li>
        <li>Workspaces</li>
        <li>Settings</li>
        {workspace && (
          <>
            <hr />
            <h3>
              <Link to={`/workspaces/${workspace.id}`}>{workspace.name}</Link>
            </h3>
            <ul className="files">
              {workspace.resources.map(resource => (
                <li key={resource.id}>
                  <ResourceView resource={resource} />
                </li>
              ))}
            </ul>
          </>
        )}
      </ul>
    </div>
  );
}

export default Sidebar;
