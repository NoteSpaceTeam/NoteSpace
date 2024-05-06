import './Header.scss';
import useWorkspace from '@domain/workspace/useWorkspace';

function Header() {
  const { filePath } = useWorkspace();
  return (
    <header>
      <p>{filePath}</p>
    </header>
  );
}

export default Header;
