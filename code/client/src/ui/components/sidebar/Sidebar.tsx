import './Sidebar.scss';
import { IoClose, IoMenu } from 'react-icons/io5';
import { useState } from 'react';
import { Link } from 'react-router-dom';

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="sidebar" style={{ width: isOpen ? '15%' : '0', transition: '0.3s' }}>
      <button onClick={() => setIsOpen(prev => !prev)}>
        {isOpen ? <IoClose className="icon-close" /> : <IoMenu className="icon-menu" />}
      </button>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>Recent</li>
        <li>Workspaces</li>
        <li>Settings</li>
      </ul>
    </div>
  );
}

export default Sidebar;
