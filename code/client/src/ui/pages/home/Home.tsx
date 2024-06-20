import { Link } from 'react-router-dom';
import './Home.scss';

function Home() {
  return (
    <div className="home">
      <h2>Home</h2>
      <p>Welcome to the home page</p>
      <Link to="/workspaces">Go to Workspaces</Link>
    </div>
  );
}

export default Home;
