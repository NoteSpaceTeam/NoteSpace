import { useAuth } from '@/contexts/auth/useAuth';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ChangeEvent, FormEvent, useState } from 'react';
import './Header.scss';

function Header() {
  const { currentUser, logout } = useAuth();
  const [searchInput, setSearchInput] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  function handleSearchInput(e: ChangeEvent<HTMLInputElement>) {
    setSearchInput(e.target.value);
  }

  function handleSearchSubmit(e: FormEvent) {
    e.preventDefault();
    navigate(`/search?query=${searchInput}`);
  }

  return (
    <header className="header">
      <Link to={currentUser ? '/home' : '/'}>NoteSpace</Link>
      <div>
        {location.pathname !== '/' && (
          <form onSubmit={handleSearchSubmit}>
            <input
              type="text"
              placeholder="Search workspaces..."
              onInput={handleSearchInput}
              spellCheck={false}
              maxLength={20}
            />
          </form>
        )}

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
