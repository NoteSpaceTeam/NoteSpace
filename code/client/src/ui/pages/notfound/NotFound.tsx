import { Link } from 'react-router-dom';
import './NotFound.scss';

function NotFound() {
  return (
    <div className="not-found">
      <h2>Page not found</h2>
      <p>The page you are looking for does not exist</p>
      <Link to="/">Go Home</Link>
    </div>
  );
}

export default NotFound;
