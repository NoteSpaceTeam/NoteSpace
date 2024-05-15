import { IoMenu } from 'react-icons/io5';
import { Link, useParams } from 'react-router-dom';
import { RiMenuFold2Line, RiMenuFoldLine } from 'react-icons/ri';
import useWorkspace from '@ui/contexts/workspace/useWorkspace';
import useSidebarState from '@ui/components/sidebar/hooks/useSidebarState.ts';
import ResourceView from '@ui/components/sidebar/components/ResourceView.tsx';
import './Sidebar.scss';

function Sidebar() {
  const { isOpen, isLocked, handleClick, handleMouseEnter, handleMouseLeave } = useSidebarState();
  const { workspace, resources } = useWorkspace();
  const { wid } = useParams();

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
            {resources && (
              <ul className="files">
                {resources?.map(resource => (
                  <li key={resource.id}>
                    <ResourceView resource={{ ...resource, workspace: wid! }} />
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </ul>
    </div>
  );
}

export default Sidebar;
