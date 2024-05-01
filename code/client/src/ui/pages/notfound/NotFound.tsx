import { Link } from 'react-router-dom';
import './NotFound.scss';

function NotFound() {
  return (
    <div className="not-found">
      <h2>Not Found</h2>
      <Link to="/">Go Home</Link>
    </div>
  );
}

export default NotFound;
