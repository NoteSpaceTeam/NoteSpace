import { IoMenu, IoTime } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import { RiMenuFold2Line, RiMenuFoldLine, RiTeamFill } from 'react-icons/ri';
import useWorkspace from '@ui/contexts/workspace/useWorkspace';
import useSidebarState from '@ui/components/sidebar/hooks/useSidebarState';
import './Sidebar.scss';
import WorkspaceTree from '@ui/components/sidebar/components/workspace-tree/WorkspaceTree';
import { IoMdSettings } from 'react-icons/io';
import { TiHome } from 'react-icons/ti';

function Sidebar() {
  const { isOpen, isLocked, isLoaded, handleClick, handleMouseEnter, handleMouseLeave } = useSidebarState();
  const { workspace, resources, operations } = useWorkspace();

  if (!isLoaded) return null;
  return (
    <div
      className="sidebar"
      style={{ width: isOpen ? '20%' : '0', transition: '0.3s' }}
      onMouseLeave={handleMouseLeave}
    >
      <div className="sidebar-header">
        <button onMouseEnter={handleMouseEnter} onClick={handleClick}>
          {isLocked ? (
            <RiMenuFoldLine className="icon" />
          ) : isOpen ? (
            <RiMenuFold2Line className="icon" />
          ) : (
            <IoMenu className="icon-menu" />
          )}
        </button>
        <Link to="/">NoteSpace</Link>
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
            <h3>
              <Link to={`/workspaces/${workspace.id}`}>{workspace.name}</Link>
            </h3>
            <WorkspaceTree workspace={workspace} resources={resources} operations={operations} />
          </>
        )}
      </ul>
    </div>
  );
}

export default Sidebar;
