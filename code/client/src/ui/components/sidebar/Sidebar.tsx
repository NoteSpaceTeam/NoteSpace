import { IoDocumentText, IoMenu } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import './Sidebar.scss';
import { RiMenuFold2Line, RiMenuFoldLine } from 'react-icons/ri';
import useWorkspace from '@domain/workspace/useWorkspace.ts';
import useSidebarState from '@ui/components/sidebar/hooks/useSidebarState.ts';
import { FaFolder } from 'react-icons/fa6';
import { ResourceType } from '@notespace/shared/src/workspace/types/resource.ts';

function Sidebar() {
  const { isOpen, isLocked, handleClick, handleMouseEnter, handleMouseLeave } = useSidebarState();
  const { workspace } = useWorkspace();

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
            <h3>My Files</h3>
            <div className="files">
              {workspace?.resources.map(resource => (
                <li key={resource.id}>
                  <Link to={`/workspaces/${workspace.id}/${resource.id}`}>
                    {resource.type === ResourceType.DOCUMENT ? <IoDocumentText /> : <FaFolder />}
                    {resource.name}
                  </Link>
                </li>
              ))}
            </div>
          </>
        )}
      </ul>
    </div>
  );
}

export default Sidebar;
