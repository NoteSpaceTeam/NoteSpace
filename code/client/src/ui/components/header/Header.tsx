import './Header.scss';
import { useAuth } from '@ui/contexts/auth/useAuth';

function Header() {
  const { currentUser, logout } = useAuth();
  return (
    <header className="header">
      <p></p>
      <div>
        <p>{currentUser?.email}</p>
        <button onClick={logout}>Logout</button>
      </div>
    </header>
  );
}

export default Header;
