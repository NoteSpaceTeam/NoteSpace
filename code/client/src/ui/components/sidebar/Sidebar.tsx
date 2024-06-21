import { IoMenu, IoTime } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import { RiMenuFold2Line, RiMenuFoldLine, RiTeamFill } from 'react-icons/ri';
import useWorkspace from '@/contexts/workspace/useWorkspace';
import useSidebarState from '@ui/components/sidebar/hooks/useSidebarState';
import WorkspaceTree from '@ui/components/sidebar/components/workspace-tree/WorkspaceTree';
import { IoMdSettings } from 'react-icons/io';
import { TiHome } from 'react-icons/ti';
import { GoPlus } from 'react-icons/go';
import { ResourceType } from '@notespace/shared/src/workspace/types/resource';
import CreateResourceMenu from '@ui/components/sidebar/components/CreateResourceMenu';
import './Sidebar.scss';

function Sidebar() {
  const { width, isOpen, isLocked, isLoaded, handlers } = useSidebarState();
  const { workspace, resources, operations } = useWorkspace();

  if (!isLoaded) return null;
  return (
    <div className="sidebar" style={{ width }} onMouseLeave={handlers.handleMouseLeave}>
      <div onMouseDown={handlers.handleMouseDown} className="dragger" />
      <div className="sidebar-header">
        <button onMouseEnter={handlers.handleMouseEnter} onClick={handlers.handleClick}>
          {isLocked ? (
            <RiMenuFoldLine className="icon" />
          ) : isOpen ? (
            <RiMenuFold2Line className="icon" />
          ) : (
            <IoMenu className="icon-menu" />
          )}
        </button>
      </div>
      <ul>
        <li>
          <TiHome />
          <Link to="/">Home</Link>
        </li>
        <li>
          <RiTeamFill />
          <Link to="/workspaces">Workspaces</Link>
        </li>
        <li>
          <IoTime />
          <Link to="/recent">Recent</Link>
        </li>
        <li>
          <IoMdSettings />
          <Link to="/settings">Settings</Link>
        </li>
        <hr />
        {workspace && operations && resources && (
          <>
            <div className="workspace-header">
              <h3>
                <Link to={`/workspaces/${workspace.id}`}>{workspace.name}</Link>
              </h3>
              <CreateResourceMenu
                onCreateNew={(type: ResourceType) => operations.createResource('Untitled', type, workspace.id)}
                trigger="sidebar-create-resource"
              />
              <button id="sidebar-create-resource">
                <GoPlus />
              </button>
            </div>
            <WorkspaceTree workspace={workspace} resources={resources} operations={operations} />
          </>
        )}
      </ul>
    </div>
  );
}

export default Sidebar;
