import './Header.scss';
import { useAuth } from '@/contexts/auth/useAuth';
import { Link } from 'react-router-dom';

function Header() {
  const { currentUser, logout } = useAuth();
  return (
    <header className="header">
      <Link to={currentUser ? '/home' : '/'}>NoteSpace</Link>
      <div>
        <div className="account">
          {currentUser && (
            <>
              <Link to={`/profile/${currentUser.uid}`}>{currentUser?.displayName}</Link>
              <button onClick={logout}>Logout</button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
