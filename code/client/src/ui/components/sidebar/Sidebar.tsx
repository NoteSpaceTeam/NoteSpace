import { IoMenu } from 'react-icons/io5';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.scss';
import { RiMenuFold2Line, RiMenuFoldLine } from 'react-icons/ri';
import useWorkspace from '@domain/workspace/useWorkspace.ts';

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [justClosed, setJustClosed] = useState(false);
  const { resources } = useWorkspace();

  const handleMouseEnter = () => {
    if (justClosed) return;
    setIsOpen(true);
  };

  const handleClick = () => {
    setIsLocked(!isLocked && isOpen);
    setIsOpen(!isLocked && !isOpen);
    setJustClosed(isLocked);
  };

  const handleMouseLeave = () => {
    if (isLocked) return;
    setIsOpen(false);
    setJustClosed(false);
  };

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

        {resources?.map(resource => (
          <li key={resource.id}>
            <Link to={`/workspaces/${resource.id}`}>{resource.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;
