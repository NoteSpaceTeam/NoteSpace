import { Link } from 'react-router-dom';
import './Home.scss';
import { useEffect } from 'react';
import { useCommunication } from '@ui/contexts/communication/useCommunication';

function Home() {
  const { http } = useCommunication();

  useEffect(() => {
    async function test() {
      const result = await http.get('/protected', true);
      console.log('Logged in', result);
    }
    test();
  }, [http]);

  return (
    <div className="home">
      <h2>Home</h2>
      <p>Welcome to the home page</p>
      <Link to="/workspaces">Go to Workspaces</Link>
    </div>
  );
}

export default Home;
