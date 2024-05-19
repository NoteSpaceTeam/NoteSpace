import { IoMenu, IoTime } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import { RiMenuFold2Line, RiMenuFoldLine, RiTeamFill } from 'react-icons/ri';
import useWorkspace from '@ui/contexts/workspace/useWorkspace';
import useSidebarState from '@ui/components/sidebar/hooks/useSidebarState';
import './Sidebar.scss';
import WorkspaceTree from '@ui/components/sidebar/components/WorkspaceTree';
import { FaHome } from 'react-icons/fa';
import { IoMdSettings } from 'react-icons/io';

function Sidebar() {
  const { isOpen, isLocked, handleClick, handleMouseEnter, handleMouseLeave } = useSidebarState();
  const { workspace, nodes, operations } = useWorkspace();

  return (
    <div
      className="sidebar"
      style={{ width: isOpen ? '20%' : '0', transition: '0.3s' }}
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
          <FaHome />
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
        {workspace && operations && (
          <>
            <h3>
              <Link to={`/workspaces/${workspace.id}`}>{workspace.name}</Link>
            </h3>
            <WorkspaceTree workspace={workspace} nodes={nodes} operations={operations} />
          </>
        )}
      </ul>
    </div>
  );
}

export default Sidebar;
