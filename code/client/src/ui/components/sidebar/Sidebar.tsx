import { IoMenu } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import { RiMenuFold2Line, RiMenuFoldLine } from 'react-icons/ri';
import useWorkspace from '@ui/contexts/workspace/useWorkspace';
import useSidebarState from '@ui/components/sidebar/hooks/useSidebarState';
import './Sidebar.scss';
import WorkspaceTree from '@ui/components/sidebar/components/WorkspaceTree';

function Sidebar() {
  const { isOpen, isLocked, handleClick, handleMouseEnter, handleMouseLeave } = useSidebarState();
  const { workspace, nodes } = useWorkspace();

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
        <li>Settings</li>
        {workspace && (
          <>
            <hr />
            <h3>
              <Link to={`/workspaces/${workspace.id}`}>{workspace.name}</Link>
            </h3>
            <WorkspaceTree workspace={workspace} nodes={nodes} />
          </>
        )}
      </ul>
    </div>
  );
}

export default Sidebar;
