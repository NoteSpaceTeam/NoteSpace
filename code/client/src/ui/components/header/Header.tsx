import useWorkspace from '@domain/workspace/useWorkspace';
import { Link } from 'react-router-dom';
import './Header.scss';

function Header() {
  const { filePath } = useWorkspace();
  return (
    <header>
      <Link to="/">NoteSpace</Link>
      <p>{filePath}</p>
    </header>
  );
}

export default Header;
