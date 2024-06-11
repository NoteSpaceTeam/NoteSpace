import './Header.scss';
import { useAuth } from '@ui/contexts/auth/useAuth';
import { Link } from 'react-router-dom';

function Header() {
  const { currentUser, logout } = useAuth();
  return (
    <header className="header">
      <p></p>
      <div>
        {currentUser ? (
          <>
            <p>{currentUser?.email}</p>
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </header>
  );
}

export default Header;
