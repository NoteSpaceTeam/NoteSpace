import { Link } from 'react-router-dom';
import './Header.scss';

function Header() {
  return (
    <header>
      <Link to={'/'} className="title">
        NoteSpace
      </Link>
    </header>
  );
}

export default Header;
